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

from fastapi import APIRouter
from fastapi.responses import RedirectResponse

import app.core.config as cfg
from app.core.database import get_supabase
from app.services.user_service import (
    get_tracking_row,
    increment_sessions_attended,
    upsert_tracking_field,
)

logger = logging.getLogger(__name__)
router = APIRouter()

NOON_HOUR = 12  # 12:00 in IST → pivot between morning / evening sessions


@router.get("/join/{phone_number}")
async def join_session(phone_number: str):
    """
    Passive attendance-tracking link embedded in WhatsApp reminder messages.
    Idempotent: clicking multiple times in the same session window does NOT
    increment the counter more than once.
    """
    now_ist = datetime.now(cfg.IST)
    today = now_ist.date()
    is_morning = now_ist.hour < NOON_HOUR

    db = await get_supabase()

    # Fetch existing tracking row (may be None if never upserted today)
    row = await get_tracking_row(db, phone_number, today)

    session_key = "joined_morning" if is_morning else "joined_evening"
    already_joined = row.get(session_key, False) if row else False

    if not already_joined:
        # Mark attendance
        await upsert_tracking_field(
            db, phone_number, today, {session_key: True}
        )
        # Increment session counter (only once per session)
        await increment_sessions_attended(db, phone_number)
        logger.info(
            "Attendance recorded: %s | %s | date=%s",
            phone_number,
            session_key,
            today,
        )
    else:
        logger.info(
            "Duplicate join click ignored: %s | %s | date=%s",
            phone_number,
            session_key,
            today,
        )

    return RedirectResponse(url=cfg.YOUTUBE_REDIRECT_URL, status_code=302)
