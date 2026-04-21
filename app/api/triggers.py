"""
app/api/triggers.py
--------------------
HTTP trigger endpoints for each scheduled job.

cron-job.org calls these at exact IST times:
  POST /internal/trigger/morning-1      → 06:20 AM IST
  POST /internal/trigger/morning-2      → 07:20 AM IST
  POST /internal/trigger/evening-1      → 04:50 PM IST
  POST /internal/trigger/evening-2      → 05:50 PM IST
  POST /internal/trigger/attendance     → 09:00 PM IST
  POST /internal/trigger/daily-rollover → 12:00 AM IST

Security: each request must include header  X-Trigger-Secret: <TRIGGER_SECRET env var>
"""

import logging
import os

from fastapi import APIRouter, Header, HTTPException

from app.scheduler.jobs import (
    attendance_check,
    daily_rollover,
    push_evening_1,
    push_evening_2,
    push_morning_1,
    push_morning_2,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/internal/trigger", tags=["Internal Triggers"])


def _auth(secret: str | None) -> None:
    """Validate the X-Trigger-Secret header."""
    expected = os.environ.get("TRIGGER_SECRET", "")
    if not expected:
        # If env var is not set, block all requests as a safety measure
        raise HTTPException(status_code=503, detail="TRIGGER_SECRET not configured")
    if secret != expected:
        raise HTTPException(status_code=403, detail="Forbidden")


@router.post("/morning-1")
async def trigger_morning_1(x_trigger_secret: str | None = Header(default=None)):
    """06:20 AM IST — morning reminder to ALL active trial users."""
    _auth(x_trigger_secret)
    logger.info("[TRIGGER] /morning-1 called via HTTP")
    await push_morning_1()
    return {"status": "ok", "job": "push_morning_1"}


@router.post("/morning-2")
async def trigger_morning_2(x_trigger_secret: str | None = Header(default=None)):
    """07:20 AM IST — morning reminder to users who MISSED the 6:20 AM session."""
    _auth(x_trigger_secret)
    logger.info("[TRIGGER] /morning-2 called via HTTP")
    await push_morning_2()
    return {"status": "ok", "job": "push_morning_2"}


@router.post("/evening-1")
async def trigger_evening_1(x_trigger_secret: str | None = Header(default=None)):
    """04:50 PM IST — evening reminder to ALL active trial users."""
    _auth(x_trigger_secret)
    logger.info("[TRIGGER] /evening-1 called via HTTP")
    await push_evening_1()
    return {"status": "ok", "job": "push_evening_1"}


@router.post("/evening-2")
async def trigger_evening_2(x_trigger_secret: str | None = Header(default=None)):
    """05:50 PM IST — evening reminder to users who MISSED the 4:50 PM session."""
    _auth(x_trigger_secret)
    logger.info("[TRIGGER] /evening-2 called via HTTP")
    await push_evening_2()
    return {"status": "ok", "job": "push_evening_2"}


@router.post("/attendance")
async def trigger_attendance(x_trigger_secret: str | None = Header(default=None)):
    """09:00 PM IST — send TPL_MISSED_SESSION to users who attended no session today."""
    _auth(x_trigger_secret)
    logger.info("[TRIGGER] /attendance called via HTTP")
    await attendance_check()
    return {"status": "ok", "job": "attendance_check"}


@router.post("/daily-rollover")
async def trigger_daily_rollover(x_trigger_secret: str | None = Header(default=None)):
    """12:00 AM IST — increment trial_day; fire TPL_TRIAL_ENDED when day == 15."""
    _auth(x_trigger_secret)
    logger.info("[TRIGGER] /daily-rollover called via HTTP")
    await daily_rollover()
    return {"status": "ok", "job": "daily_rollover"}
