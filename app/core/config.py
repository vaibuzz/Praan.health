"""
app/core/config.py
------------------
Central configuration module. All secrets are read from environment variables.
IST (Asia/Kolkata) is the single source of truth for all time operations.
"""

import os
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Timezone
# ---------------------------------------------------------------------------
IST = ZoneInfo("Asia/Kolkata")

# ---------------------------------------------------------------------------
# Supabase
# ---------------------------------------------------------------------------
SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY: str = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

# ---------------------------------------------------------------------------
# Twilio
# ---------------------------------------------------------------------------
TWILIO_ACCOUNT_SID: str = os.environ["TWILIO_ACCOUNT_SID"]
TWILIO_AUTH_TOKEN: str = os.environ["TWILIO_AUTH_TOKEN"]
TWILIO_WHATSAPP_FROM: str = os.environ.get(
    "TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886"
)  # Twilio sandbox / production number

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
APP_BASE_URL: str = os.environ.get("APP_BASE_URL", "http://localhost:8000")
YOUTUBE_REDIRECT_URL: str = os.environ.get(
    "YOUTUBE_REDIRECT_URL", "https://www.youtube.com/live/placeholder"
)

# ---------------------------------------------------------------------------
# Template IDs  (map logical name -> Twilio Content SID or template name)
# ---------------------------------------------------------------------------
TEMPLATE_IDS: dict[str, str] = {
    # Onboarding flow
    "tpl_welcome":              os.environ.get("TPL_WELCOME",              "tpl_welcome"),
    "tpl_batch_1_image":        os.environ.get("TPL_BATCH_1_IMAGE",        "tpl_batch_1_image"),
    "tpl_batch_2_list":         os.environ.get("TPL_BATCH_2_LIST",         "tpl_batch_2_list"),
    "tpl_orientation":          os.environ.get("TPL_ORIENTATION",          "tpl_orientation"),
    "tpl_step_4_invite":        os.environ.get("TPL_STEP_4_INVITE",        "tpl_step_4_invite"),
    "tpl_next_session_confirm": os.environ.get("TPL_NEXT_SESSION_CONFIRM", "tpl_next_session_confirm"),
    "tpl_referral_success":     os.environ.get("TPL_REFERRAL_SUCCESS",     "tpl_referral_success"),
    # Daily automation
    "tpl_morning_reminder":     os.environ.get("TPL_DAILY_REMINDER",       "tpl_morning_reminder"),
    "tpl_evening_reminder":     os.environ.get("TPL_DAILY_REMINDER",       "tpl_evening_reminder"),
    "tpl_missed_session":       os.environ.get("TPL_MISSED_SESSION",       "tpl_missed_session"),
    "tpl_trial_ended":          os.environ.get("TPL_TRIAL_ENDED",          "tpl_trial_ended"),
    # Feedback & Engagement
    "tpl_feedback_request":     os.environ.get("TPL_FEEDBACK_REQUEST",     "tpl_feedback_request"),
    "tpl_feedback_reply":       os.environ.get("TPL_FEEDBACK_REPLY",       "tpl_feedback_reply"),
}

