"""
app/api/join.py
----------------
Module 2: Smart Join / Attendance Tracking Link (GET /join/{phone_number})

Logic (all times in IST):
  - Before 12:00 PM  → mark joined_morning = True
  - 12:00 PM or after → mark joined_evening = True
  - Increment total_sessions_attended ONCE per session per day (idempotency enforced).
  - Redirect user to the YouTube live URL.
"""

import logging
from datetime import datetime

from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import RedirectResponse

import app.core.config as cfg
from app.core.database import get_supabase
from app.services.user_service import (
    get_tracking_row,
    get_user,
    increment_sessions_attended,
    upsert_tracking_field,
)
from app.services.messaging import send_whatsapp_template

logger = logging.getLogger(__name__)
router = APIRouter()

NOON_HOUR = 12  # 12:00 in IST → pivot between morning / evening sessions


@router.get("/join/{phone_number}")
async def join_session(phone_number: str, background_tasks: BackgroundTasks):
    """
    Passive attendance-tracking link embedded in WhatsApp reminder messages.
    Idempotent: clicking multiple times in the same session window does NOT
    increment the counter more than once.
    """
    now_ist = datetime.now(cfg.IST)
    today = now_ist.date()
    is_morning = now_ist.hour < NOON_HOUR

    db = await get_supabase()

    # Fetch existing tracking row
    row = await get_tracking_row(db, phone_number, today)

    session_key = "joined_morning" if is_morning else "joined_evening"
    time_key = "preferred_morning_time" if is_morning else "preferred_evening_time"
    already_joined = row.get(session_key, False) if row else False

    if not already_joined:
        # Mark attendance and specific join time
        join_time_str = now_ist.strftime("%I:%M %p")
        await upsert_tracking_field(
            db, phone_number, today, {session_key: True, time_key: join_time_str}
        )
        # Increment session counter
        await increment_sessions_attended(db, phone_number)
        logger.info(
            "Attendance recorded: %s | %s | %s | date=%s",
            phone_number,
            session_key,
            join_time_str,
            today,
        )
        
        # Late Join Check (1 hour after latest session starts)
        # Morning ends globally around 8:30 AM (1 hr after 7:30 AM)
        # Evening ends globally around 7:00 PM (1 hr after 6:00 PM)
        is_late_morning = is_morning and (now_ist.hour >= 8 and now_ist.minute >= 30 or now_ist.hour > 8)
        is_late_evening = not is_morning and (now_ist.hour >= 19)
        
        if is_late_morning or is_late_evening:
            # Look up name for template variable
            u = await get_user(db, phone_number)
            name = u.get("name", "Friend") if u else "Friend"
            
            background_tasks.add_task(
                send_whatsapp_template,
                phone_number,
                "tpl_feedback_request",
                {"2": name}
            )
            logger.info("Sent late-join feedback trigger to %s", phone_number)

    else:
        logger.info(
            "Duplicate join click ignored: %s | %s | date=%s",
            phone_number,
            session_key,
            today,
        )

    return RedirectResponse(url=cfg.YOUTUBE_REDIRECT_URL, status_code=302)
