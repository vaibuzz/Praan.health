"""
app/scheduler/jobs.py
----------------------
Module 3: APScheduler cron jobs – all fire in IST (Asia/Kolkata).

Schedule:
  05:30 AM  → morning_push         – send tpl_morning_reminder to all trial users
  04:00 PM  → evening_push         – send tpl_evening_reminder to all trial users
  09:00 PM  → attendance_check     – missed-session or feedback template
  00:00 AM  → daily_rollover       – increment trial_day; fire trial-ended if day == 15

All jobs are async-friendly: run in the same asyncio event loop as FastAPI.
"""

import asyncio
import logging
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

import app.core.config as cfg
from app.core.database import get_supabase
from app.services.messaging import send_whatsapp_template
from app.services.user_service import (
    get_active_trial_users,
    get_tracking_row,
    increment_trial_day,
)

logger = logging.getLogger(__name__)

FOCUS_TOPICS = [
    "Back pain reeducation",
    "Muscle strengthening",
    "Knee joint mobility",
    "Spinal flexibility",
    "Core stability",
    "Full body relaxation"
]

def get_focus(trial_day: int) -> str:
    # Safely handle trial days starting at 1
    day_index = (trial_day - 1) if trial_day > 0 else 0
    return FOCUS_TOPICS[day_index % len(FOCUS_TOPICS)]


# ---------------------------------------------------------------------------
# Helper: build the personalised join URL
# ---------------------------------------------------------------------------
def _join_url(phone_number: str) -> str:
    return f"{cfg.APP_BASE_URL}/join/{phone_number}"


# ---------------------------------------------------------------------------
# Job 1A – Morning Session 1 Push (e.g. 06:15 AM)
# ---------------------------------------------------------------------------
async def push_morning_1() -> None:
    logger.info("[SCHEDULER] push_morning_1 (6:30 AM) fired at %s IST", datetime.now(cfg.IST))
    db = await get_supabase()
    users = await get_active_trial_users(db)
    
    tasks = []
    for u in users:
        focus = get_focus(u.get("trial_day", 1))
        tasks.append(send_whatsapp_template(
            to_number=u["phone_number"],
            template_id="tpl_morning_reminder",
            variables={"2": u.get("name", "friend"), "3": "6:30 AM", "4": focus}
        ))
        
    results = await asyncio.gather(*tasks, return_exceptions=True)
    for user, result in zip(users, results):
        if isinstance(result, Exception):
            logger.error("push_morning_1 failed for %s: %s", user["phone_number"], result)
    logger.info("[SCHEDULER] push_morning_1 done – %d users notified.", len(users))


# ---------------------------------------------------------------------------
# Job 1B – Morning Session 2 Push (e.g. 07:15 AM)
# ---------------------------------------------------------------------------
async def push_morning_2() -> None:
    logger.info("[SCHEDULER] push_morning_2 (7:30 AM) fired at %s IST", datetime.now(cfg.IST))
    db = await get_supabase()
    users = await get_active_trial_users(db)
    today = datetime.now(cfg.IST).date()
    
    tasks = []
    notified_count = 0
    for u in users:
        phone = u["phone_number"]
        row = await get_tracking_row(db, phone, today)
        joined_morning = row.get("joined_morning", False) if row else False
        
        if not joined_morning:
            focus = get_focus(u.get("trial_day", 1))
            tasks.append(send_whatsapp_template(
                to_number=phone,
                template_id="tpl_morning_reminder",
                variables={"2": u.get("name", "friend"), "3": "7:30 AM", "4": focus}
            ))
            notified_count += 1
            
    results = await asyncio.gather(*tasks, return_exceptions=True)
    for u, result in zip(users, results):
        if isinstance(result, Exception):
            logger.error("push_morning_2 failed for %s: %s", u["phone_number"], result)
    logger.info("[SCHEDULER] push_morning_2 done – %d users notified.", notified_count)


# ---------------------------------------------------------------------------
# Job 2A – Evening Session 1 Push (e.g. 04:45 PM)
# ---------------------------------------------------------------------------
async def push_evening_1() -> None:
    logger.info("[SCHEDULER] push_evening_1 (5:00 PM) fired at %s IST", datetime.now(cfg.IST))
    db = await get_supabase()
    users = await get_active_trial_users(db)
    
    tasks = []
    for u in users:
        focus = get_focus(u.get("trial_day", 1))
        tasks.append(send_whatsapp_template(
            to_number=u["phone_number"],
            template_id="tpl_evening_reminder",
            variables={"2": u.get("name", "friend"), "3": "5:00 PM", "4": focus}
        ))
        
    results = await asyncio.gather(*tasks, return_exceptions=True)
    for user, result in zip(users, results):
        if isinstance(result, Exception):
            logger.error("push_evening_1 failed for %s: %s", user["phone_number"], result)
    logger.info("[SCHEDULER] push_evening_1 done – %d users notified.", len(users))


# ---------------------------------------------------------------------------
# Job 2B – Evening Session 2 Push (e.g. 05:45 PM)
# ---------------------------------------------------------------------------
async def push_evening_2() -> None:
    logger.info("[SCHEDULER] push_evening_2 (6:00 PM) fired at %s IST", datetime.now(cfg.IST))
    db = await get_supabase()
    users = await get_active_trial_users(db)
    today = datetime.now(cfg.IST).date()
    
    tasks = []
    notified_count = 0
    for u in users:
        phone = u["phone_number"]
        row = await get_tracking_row(db, phone, today)
        joined_evening = row.get("joined_evening", False) if row else False
        
        if not joined_evening:
            focus = get_focus(u.get("trial_day", 1))
            tasks.append(send_whatsapp_template(
                to_number=phone,
                template_id="tpl_evening_reminder",
                variables={"2": u.get("name", "friend"), "3": "6:00 PM", "4": focus}
            ))
            notified_count += 1
            
    results = await asyncio.gather(*tasks, return_exceptions=True)
    for u, result in zip(users, results):
        if isinstance(result, Exception):
            logger.error("push_evening_2 failed for %s: %s", u["phone_number"], result)
    logger.info("[SCHEDULER] push_evening_2 done – %d users notified.", notified_count)


# ---------------------------------------------------------------------------
# Job 3 – 09:00 PM IST: Attendance check
# ---------------------------------------------------------------------------
async def attendance_check() -> None:
    logger.info("[SCHEDULER] attendance_check fired at %s IST", datetime.now(cfg.IST))
    db = await get_supabase()
    users = await get_active_trial_users(db)
    today = datetime.now(cfg.IST).date()

    tasks = []
    for user in users:
        phone = user["phone_number"]
        row = await get_tracking_row(db, phone, today)

        joined_morning = row.get("joined_morning", False) if row else False
        joined_evening = row.get("joined_evening", False) if row else False

        if not joined_morning and not joined_evening:
            # Complete miss → send missed-session nudge
            tasks.append(
                send_whatsapp_template(
                    to_number=phone,
                    template_id="tpl_missed_session",
                    variables={"2": user.get("name", "friend")},
                )
            )
        else:
            # Attended at least one session → request feedback
            tasks.append(
                send_whatsapp_template(
                    to_number=phone,
                    template_id="tpl_feedback_request",
                    variables={"2": user.get("name", "friend")},
                )
            )

    results = await asyncio.gather(*tasks, return_exceptions=True)
    for user, result in zip(users, results):
        if isinstance(result, Exception):
            logger.error(
                "attendance_check msg failed for %s: %s",
                user["phone_number"],
                result,
            )
    logger.info(
        "[SCHEDULER] attendance_check done – processed %d users.", len(users)
    )


# ---------------------------------------------------------------------------
# Job 4 – 00:00 AM IST: Daily rollover
# ---------------------------------------------------------------------------
async def daily_rollover() -> None:
    logger.info("[SCHEDULER] daily_rollover fired at %s IST", datetime.now(cfg.IST))
    db = await get_supabase()
    users = await get_active_trial_users(db)

    end_of_trial_tasks = []
    for user in users:
        phone = user["phone_number"]
        try:
            new_day = await increment_trial_day(db, phone)
            if new_day == 15:
                logger.info("Trial ended for %s (day 15 reached).", phone)
                end_of_trial_tasks.append(
                    send_whatsapp_template(
                        to_number=phone,
                        template_id="tpl_trial_ended",
                        variables={"2": user.get("name", "friend")},
                    )
                )
        except Exception as exc:  # noqa: BLE001
            logger.error("daily_rollover increment failed for %s: %s", phone, exc)

    if end_of_trial_tasks:
        results = await asyncio.gather(*end_of_trial_tasks, return_exceptions=True)
        for result in results:
            if isinstance(result, Exception):
                logger.error("trial_ended template failed: %s", result)

    logger.info("[SCHEDULER] daily_rollover done – %d users rolled over.", len(users))


# ---------------------------------------------------------------------------
# Scheduler factory
# ---------------------------------------------------------------------------
def create_scheduler() -> AsyncIOScheduler:
    """
    Build and return the APScheduler instance with all four cron jobs,
    all locked to IST (Asia/Kolkata).
    """
    scheduler = AsyncIOScheduler(timezone=str(cfg.IST))

    # 06:15 AM IST
    scheduler.add_job(
        push_morning_1,
        CronTrigger(hour=6, minute=15, timezone=cfg.IST),
        id="push_morning_1",
        name="Morning Session 1 Reminder",
        replace_existing=True,
    )

    # 07:15 AM IST
    scheduler.add_job(
        push_morning_2,
        CronTrigger(hour=7, minute=15, timezone=cfg.IST),
        id="push_morning_2",
        name="Morning Session 2 Reminder",
        replace_existing=True,
    )

    # 04:45 PM IST
    scheduler.add_job(
        push_evening_1,
        CronTrigger(hour=16, minute=45, timezone=cfg.IST),
        id="push_evening_1",
        name="Evening Session 1 Reminder",
        replace_existing=True,
    )

    # 05:45 PM IST
    scheduler.add_job(
        push_evening_2,
        CronTrigger(hour=17, minute=45, timezone=cfg.IST),
        id="push_evening_2",
        name="Evening Session 2 Reminder",
        replace_existing=True,
    )

    # 09:00 PM IST
    scheduler.add_job(
        attendance_check,
        CronTrigger(hour=21, minute=0, timezone=cfg.IST),
        id="attendance_check",
        name="Attendance Check & Feedback",
        replace_existing=True,
    )

    # 00:00 AM IST (midnight)
    scheduler.add_job(
        daily_rollover,
        CronTrigger(hour=0, minute=0, timezone=cfg.IST),
        id="daily_rollover",
        name="Daily Trial Day Rollover",
        replace_existing=True,
    )

    return scheduler
