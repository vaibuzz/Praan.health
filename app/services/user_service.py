"""
app/services/user_service.py
-----------------------------
Pure database helpers for the `users` table. All functions are async and
return plain Python dicts (or lists of dicts) from Supabase rows.
"""

import logging
from datetime import date

from supabase._async.client import AsyncClient

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Read helpers
# ---------------------------------------------------------------------------

async def get_user(db: AsyncClient, phone_number: str) -> dict | None:
    """Fetch a single user by primary key. Returns None if not found."""
    res = (
        await db.table("users")
        .select("*")
        .eq("phone_number", phone_number)
        .maybe_single()
        .execute()
    )
    return res.data if res else None


async def get_active_trial_users(db: AsyncClient) -> list[dict]:
    """Return all users on the trial plan who haven't exceeded day 14."""
    res = (
        await db.table("users")
        .select("*")
        .eq("account_type", "trial")
        .lte("trial_day", 14)
        .execute()
    )
    return res.data or []


# ---------------------------------------------------------------------------
# Write helpers
# ---------------------------------------------------------------------------

async def update_user_step(db: AsyncClient, phone_number: str, step: str) -> None:
    """Transition a user's state machine step."""
    await (
        db.table("users")
        .update({"current_step": step})
        .eq("phone_number", phone_number)
        .execute()
    )
    logger.info("User %s → step '%s'", phone_number, step)


async def increment_trial_day(db: AsyncClient, phone_number: str) -> int:
    """
    Increment trial_day by 1 for a user.
    Returns the new trial_day value.
    """
    user = await get_user(db, phone_number)
    if not user:
        raise ValueError(f"User {phone_number} not found")
    new_day = user["trial_day"] + 1
    await (
        db.table("users")
        .update({"trial_day": new_day})
        .eq("phone_number", phone_number)
        .execute()
    )
    return new_day


async def increment_sessions_attended(db: AsyncClient, phone_number: str) -> None:
    """
    Increment total_sessions_attended by 1.
    Idempotency is handled at the call site (by checking the tracking row).
    """
    user = await get_user(db, phone_number)
    if not user:
        return
    new_count = user["total_sessions_attended"] + 1
    await (
        db.table("users")
        .update({"total_sessions_attended": new_count})
        .eq("phone_number", phone_number)
        .execute()
    )


# ---------------------------------------------------------------------------
# daily_tracking helpers
# ---------------------------------------------------------------------------

async def get_tracking_row(
    db: AsyncClient, phone_number: str, for_date: date
) -> dict | None:
    """Fetch today's tracking row for a user."""
    res = (
        await db.table("daily_tracking")
        .select("*")
        .eq("user_phone", phone_number)
        .eq("date", str(for_date))
        .maybe_single()
        .execute()
    )
    return res.data if res else None


async def upsert_tracking_field(
    db: AsyncClient,
    phone_number: str,
    for_date: date,
    field_updates: dict,
) -> dict:
    """
    Upsert a daily_tracking row with the provided field updates.
    The composite conflict target is (user_phone, date).
    Returns the resulting row.
    """
    payload = {
        "user_phone": phone_number,
        "date": str(for_date),
        **field_updates,
    }
    res = (
        await db.table("daily_tracking")
        .upsert(payload, on_conflict="user_phone,date")
        .execute()
    )
    return res.data[0] if res.data else payload


async def set_preferred_time(
    db: AsyncClient,
    phone_number: str,
    for_date: date,
    session: str,          # "morning" or "evening"
    time_str: str,         # e.g. "06:30"
) -> None:
    """Store the user's preferred batch time for a session directly on the users table."""
    await (
        db.table("users")
        .update({"preferred_time": time_str})
        .eq("phone_number", phone_number)
        .execute()
    )
    logger.info(
        "Set %s preferred_time = %s in users table", phone_number, time_str
    )
