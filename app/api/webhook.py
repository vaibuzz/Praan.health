"""
app/api/webhook.py
-------------------
Twilio WhatsApp Webhook — State-Driven Onboarding Bot

Phases:
  A  join crack-stream     → Backend Welcome + TPL_WELCOME
  B  onboarding_step_2     → TPL_BATCH_1_IMAGE + TPL_BATCH_2_LIST
  C  batch_*               → TPL_ORIENTATION + TPL_STEP_4_INVITE
  D  join_tommrow          → Backend Confirmation + TPL_NEXT_SESSION_CONFIRM
  E  feedback_*            → TPL_FEEDBACK_REPLY
"""

import os
import logging
import asyncio
from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Form, Request, BackgroundTasks
from fastapi.responses import Response

from app.core.database import get_supabase
from app.services.messaging import (
    send_whatsapp_template,
    send_whatsapp_message,
    send_whatsapp_media_message,
)
from app.services.user_service import set_preferred_time, update_user_step, get_user
from app.core.config import IST

logger = logging.getLogger(__name__)
router = APIRouter()

TWIML_OK = "<Response></Response>"


def _today_ist():
    return datetime.now(IST).date()


def _format_batch_time(raw: str | None) -> str:
    """Convert a 4-digit time string like '0630' to '6:30 AM'."""
    if raw and len(raw) == 4:
        try:
            t = datetime.strptime(raw, "%H%M")
            return t.strftime("%I:%M %p").lstrip("0")
        except ValueError:
            pass
    return "your preferred time"


# ==============================================================================
# PHASE A — Initial Join
# ==============================================================================

async def _phase_a_join(user_phone: str, db, user: dict | None):
    """
    Trigger : 'join crack-stream'
    Step 1  : Backend text  (Quick Welcome)
    Step 2  : Backend media (Namaste text + hero image) — 0s gap
    Step 3  : TPL_BATCH_1_IMAGE  — 5s gap
    Step 4  : TPL_BATCH_2_LIST   — 7s gap
    """
    name = user.get("name", "Friend") if user else "Friend"

    # Dynamic date
    now_ist = datetime.now(IST)
    def _suffix(d):
        return "th" if 11 <= d <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(d % 10, "th")
    dynamic_date = f"{now_ist.day}{_suffix(now_ist.day)} {now_ist.strftime('%B')}"

    # ── 3s buffer: let Twilio Sandbox "you are all set" arrive first ──────
    await asyncio.sleep(3.0)

    # ── Step 1: Backend plain text welcome ───────────────────────────────
    msg_welcome = (
        f"Welcome {name} Ji, let's start! 🚀\n\n"
        f"Your 14-Day FREE YOGA Journey\n"
        f"Starts {dynamic_date} 😄🧘"
    )
    await send_whatsapp_message(user_phone, msg_welcome)

    # ── Step 2: Backend media (Namaste text + image) — 0s gap ────────────
    msg_namaste = (
        f"Namaste {name} Ji! 🙏✨\n"
        "Welcome to the Praan Health family! 🌿\n\n"
        "We are honored to guide you through your 14-Day Senior Strength & Mobility Trial. 🚶‍♂️💪 \n"
        "Our physician-backed program is designed to gently reduce joint pain, improve your balance, \n"
        "and help you move with confidence. 🌈🧘‍♂️\n\n"
        "Your journey to a healthier, pain-free life starts right now! 🌼🌞\n"
        "---\n"
        "Praan Health - Care for your parents."
    )
    hero_image_url = "https://raw.githubusercontent.com/vaibuzz/Loan-approval-ML-project-/main/WhatsApp%20Image%202026-04-17%20at%2012.23.24%20AM.jpeg"
    await send_whatsapp_media_message(user_phone, msg_namaste, hero_image_url)

    # ── Step 3: TPL_BATCH_1_IMAGE — 10s gap ──────────────────────────────
    await asyncio.sleep(10.0)
    tpl_batch_1_sid = os.getenv("TPL_BATCH_1_IMAGE")
    await send_whatsapp_template(user_phone, tpl_batch_1_sid, [])

    # ── Step 4: TPL_BATCH_2_LIST — 7s gap ────────────────────────────────
    await asyncio.sleep(7.0)
    tpl_batch_2_sid = os.getenv("TPL_BATCH_2_LIST")
    await send_whatsapp_template(user_phone, tpl_batch_2_sid, [])

    if user:
        await update_user_step(db, user_phone, "batch_selection")

        # ── Referral notification ─────────────────────────────────────────
        # If this user was referred by someone, notify the referrer
        referred_by_phone = user.get("referred_by")
        if referred_by_phone:
            try:
                referrer = await get_user(db, referred_by_phone)
                if referrer:
                    referrer_name = referrer.get("name", "Friend")
                    new_user_name = user.get("name", "your friend")
                    tpl_referral_sid = os.getenv("TPL_REFERRAL_SUCCESS")
                    await send_whatsapp_template(
                        referred_by_phone, tpl_referral_sid,
                        {"1": referrer_name, "2": new_user_name},
                    )
                    logger.info(
                        "Referral success: notified %s that %s joined",
                        referred_by_phone, user_phone,
                    )
            except Exception as exc:
                logger.error("Referral notification failed: %s", exc)


# ==============================================================================
# PHASE B — Batch Setup  (kept for manual webhook trigger fallback)
# ==============================================================================

async def _phase_b_batch_setup(user_phone: str, db):
    """
    Trigger : button ID 'onboarding_step_2' or '_onboarding_step_2'
    Fallback if user somehow triggers step 2 manually.
    Action 3: TPL_BATCH_1_IMAGE  → sleep 7.0s → Action 4: TPL_BATCH_2_LIST
    """
    tpl_batch_1_sid = os.getenv("TPL_BATCH_1_IMAGE")
    await send_whatsapp_template(user_phone, tpl_batch_1_sid, [])

    await asyncio.sleep(7.0)

    tpl_batch_2_sid = os.getenv("TPL_BATCH_2_LIST")
    await send_whatsapp_template(user_phone, tpl_batch_2_sid, [])

    await update_user_step(db, user_phone, "batch_selection")


# ==============================================================================
# PHASE C — Orientation & Referral  (User selected a batch time)
# ==============================================================================

async def _phase_c_orientation(user_phone: str, db, name: str, batch_time: str):
    """
    Trigger : any 'batch_*' list selection
    Action  : TPL_ORIENTATION → sleep 2.0s → TPL_STEP_4_INVITE → sleep 7.0s → TPL_NEXT_SESSION_CONFIRM
    """
    # Store the selection
    today = _today_ist()
    session_type = "morning" if batch_time.startswith(("0", "10", "11")) else "evening"
    await set_preferred_time(db, user_phone, today, session_type, batch_time)
    await update_user_step(db, user_phone, "onboarding_complete")

    # TPL_ORIENTATION
    tpl_orientation_sid = os.getenv("TPL_ORIENTATION")
    await send_whatsapp_template(user_phone, tpl_orientation_sid, [name])

    await asyncio.sleep(2.0)

    # TPL_STEP_4_INVITE
    tpl_step_4_sid = os.getenv("TPL_STEP_4_INVITE")
    await send_whatsapp_template(user_phone, tpl_step_4_sid, [name, user_phone])

    await asyncio.sleep(7.0)

    # TPL_NEXT_SESSION_CONFIRM — confirm first session details
    batch_time_formatted = _format_batch_time(batch_time)
    # Determine if the session is today or tomorrow
    day_string = "Tomorrow"
    if len(batch_time) == 4:
        try:
            pref_hour = int(batch_time[:2])
            now_ist = datetime.now(IST)
            if now_ist.hour < pref_hour:
                day_string = "Today"
        except ValueError:
            pass
    tpl_next_session_sid = os.getenv("TPL_NEXT_SESSION_CONFIRM")
    await send_whatsapp_template(
        user_phone, tpl_next_session_sid,
        {"1": name, "2": day_string, "3": batch_time_formatted},
    )


# ==============================================================================
# PHASE D — Retention / Missed Session  ('I WILL JOIN TOMORROW')
# ==============================================================================

async def _phase_d_join_tomorrow(user_phone: str, db, user: dict):
    """
    Trigger : button ID 'join_tommrow'
    Action  : Backend confirmation text → sleep 1.5s → TPL_NEXT_SESSION_CONFIRM
    """
    name = user.get("name", "Friend")
    batch_time_formatted = _format_batch_time(user.get("preferred_time"))

    # Backend confirmation text
    reply_msg = (
        f"That is wonderful to hear, {name} Ji! 🙌✨\n\n"
        f"I have noted your preference. We will see you tomorrow at {batch_time_formatted}! 🧘‍♂️⏰\n\n"
        "We will send you the session link 5 minutes before we start. "
        "In the meantime, try to get some good rest. "
        "A little movement tomorrow will make a big difference! 🙏🌼"
    )
    await send_whatsapp_message(user_phone, reply_msg)

    await asyncio.sleep(1.5)

    # TPL_NEXT_SESSION_CONFIRM
    day_string = "Tomorrow"
    pref_time_str = user.get("preferred_time")
    if pref_time_str and len(pref_time_str) == 4:
        try:
            pref_hour = int(pref_time_str[:2])
            now_ist = datetime.now(IST)
            if now_ist.hour < pref_hour:
                day_string = "Today"
        except ValueError:
            pass

    tpl_next_session_sid = os.getenv("TPL_NEXT_SESSION_CONFIRM")
    await send_whatsapp_template(
        user_phone, tpl_next_session_sid,
        {"1": name, "2": day_string, "3": batch_time_formatted},
    )


# ==============================================================================
# Main Webhook Endpoint
# ==============================================================================

@router.post("/twilio_webhook")
async def handle_twilio_webhook(
    background_tasks: BackgroundTasks,
    request: Request,
    Body: str = Form(None),
    From: str = Form(None),
    ButtonText: str = Form(None),
    ListId: str = Form(None),
    ButtonPayload: str = Form(None),
):
    if not From:
        return Response(content=TWIML_OK, media_type="text/xml")

    user_phone = From.replace("whatsapp:", "").strip()
    action_id = ListId or ButtonPayload or Body

    if not action_id:
        return Response(content=TWIML_OK, media_type="text/xml")

    action_id = action_id.strip()

    db = await get_supabase()
    user = await get_user(db, user_phone)

    # ── PHASE A: JOIN ─────────────────────────────────────────────────────
    if action_id.lower() == "join crack-stream":
        logger.info("PHASE A | %s | Join Flow initiated", user_phone)
        background_tasks.add_task(_phase_a_join, user_phone, db, user)
        return Response(content=TWIML_OK, media_type="text/xml")

    # All remaining phases require a known user
    if not user:
        logger.warning("Unknown sender: %s | action='%s'", user_phone, action_id)
        return Response(content=TWIML_OK, media_type="text/xml")

    name = user.get("name", "Friend")
    logger.info("Webhook from %s | action='%s'", user_phone, action_id)

    # ── PHASE B: BATCH SETUP ─────────────────────────────────────────────
    # Note: Twilio template button ID is "_onboarding_step_2" (leading underscore)
    if action_id in ("onboarding_step_2", "_onboarding_step_2"):
        logger.info("PHASE B | %s | Step 2 button clicked", user_phone)
        background_tasks.add_task(_phase_b_batch_setup, user_phone, db)

    # ── PHASE C: ORIENTATION & REFERRAL ──────────────────────────────────
    elif "batch_" in action_id:
        try:
            batch_time = action_id.split("_")[1]
        except IndexError:
            batch_time = action_id
        logger.info("PHASE C | %s | Batch selected: %s", user_phone, batch_time)
        background_tasks.add_task(_phase_c_orientation, user_phone, db, name, batch_time)

    # ── PHASE D: RETENTION (MISSED SESSION) ──────────────────────────────
    elif action_id.lower() == "join_tommrow":
        logger.info("PHASE D | %s | Join Tomorrow", user_phone)
        background_tasks.add_task(_phase_d_join_tomorrow, user_phone, db, user)

    # ── PHASE E: FEEDBACK LOOP ───────────────────────────────────────────
    elif "feedback_" in action_id:
        replies = {
            "feedback_1": "That is wonderful to hear! Consistency is key.",
            "feedback_2": "It's normal to feel tired. Your body is growing stronger!",
            "feedback_3": "Listen to your body. Stick to gentle breathing tomorrow.",
        }
        reply_text = replies.get(action_id, "Thank you for the feedback!")
        tpl_feedback_reply_sid = os.getenv("TPL_FEEDBACK_REPLY")
        background_tasks.add_task(
            send_whatsapp_template, user_phone, tpl_feedback_reply_sid, [reply_text]
        )

    return Response(content=TWIML_OK, media_type="text/xml")
