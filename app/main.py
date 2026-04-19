"""
app/main.py
-----------
FastAPI application factory.

Startup sequence:
  1. Create the async Supabase client (warm up connection pool).
  2. Start APScheduler (IST timezone, AsyncIOScheduler).
  3. Register API routers.

Shutdown:
  1. Stop APScheduler gracefully.
"""

import logging
import sys

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import join, webhook
from app.core.database import get_supabase
from app.scheduler.jobs import create_scheduler

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Lifespan: startup / shutdown hooks
# ---------------------------------------------------------------------------
_scheduler = create_scheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──────────────────────────────────────────────────────────
    logger.info("Starting Praan Health backend …")

    # Warm up Supabase connection
    try:
        await get_supabase()
        logger.info("Supabase client initialised.")
    except Exception as exc:
        logger.error("Supabase init failed: %s", exc)

    # Start scheduler
    _scheduler.start()
    logger.info("APScheduler started. Jobs: %s", [j.id for j in _scheduler.get_jobs()])

    yield  # ← application runs here

    # ── Shutdown ──────────────────────────────────────────────────────────
    _scheduler.shutdown(wait=False)
    logger.info("APScheduler stopped. Praan Health backend shutting down.")


# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Praan Health API",
    description="WhatsApp state machine, attendance tracking, and scheduler backend.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(webhook.router, tags=["Twilio Webhook"])
app.include_router(join.router, tags=["Attendance"])


from pydantic import BaseModel
from fastapi import BackgroundTasks, HTTPException

class SignupRequest(BaseModel):
    phone_number: str
    name: str
    referred_by: str | None = None

@app.post("/signup", tags=["Users"])
async def register_user(req: SignupRequest, background_tasks: BackgroundTasks):
    """
    Register a new user from the frontend or web form.
    Handles the referral loop by notifying the referrer if applicable.
    """
    from app.core.database import get_supabase
    db = await get_supabase()
    
    clean_phone = req.phone_number.strip()
    if not clean_phone.startswith("+"):
        clean_phone = "+" + clean_phone.lstrip("0")
        
    try:
        await (
            db.table("users")
            .insert({
                "phone_number": clean_phone,
                "name": req.name,
                "referred_by": req.referred_by,
                "current_step": "registered",
                "account_type": "trial",
                "trial_day": 1,
                "total_sessions_attended": 0
            })
            .execute()
        )
    except Exception as exc:
        logger.error(f"User creation failed: {exc}")
        raise HTTPException(status_code=400, detail="User already exists or invalid data")

    # Referral Success Logic
    if req.referred_by:
        ref_phone = req.referred_by.strip()
        if not ref_phone.startswith("+"):
            ref_phone = "+" + ref_phone.lstrip("0")
            
        referrer_res = await db.table("users").select("name").eq("phone_number", ref_phone).maybe_single().execute()
        if referrer_res.data:
            referrer_name = referrer_res.data.get("name", "Friend")
            from app.services.messaging import send_whatsapp_template
            # Issue TPL_REFERRAL_SUCCESS to the Referrer
            background_tasks.add_task(
                send_whatsapp_template, ref_phone, "tpl_referral_success", [referrer_name, req.name]
            )

    return {"status": "success", "message": "User registered successfully"}


# ---------------------------------------------------------------------------
# Root probe (used by cron-job.org keep-alive)
# ---------------------------------------------------------------------------
@app.get("/", tags=["Meta"])
async def root():
    return {"status": "Praan Health Backend is Live and Healthy"}


# ---------------------------------------------------------------------------
# Health probe
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Meta"])
async def health_check():
    from datetime import datetime
    from app.core.config import IST
    return {
        "status": "ok",
        "ist_time": datetime.now(IST).isoformat(),
        "scheduler_jobs": [
            {"id": j.id, "next_run": str(j.next_run_time)} for j in _scheduler.get_jobs()
        ],
    }
