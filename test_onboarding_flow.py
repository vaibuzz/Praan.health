"""
test_onboarding_flow.py
------------------------
Interactive test script for the WhatsApp onboarding flow.

Mirrors the exact production sequence in app/api/webhook.py.

Usage:  python test_onboarding_flow.py
"""

import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# ── CRITICAL: Load .env before any os.getenv() calls ─────────────────────────
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime
from app.core.config import IST
from app.services.messaging import (
    send_whatsapp_template,
    send_whatsapp_message,
    send_whatsapp_media_message,
)

# ── User Details ──────────────────────────────────────────────────────────────
USER_PHONE = "+919970263372"
USER_NAME  = "Vaibhav Sunil Patil"


async def run_full_sequence():
    """
    Full join sequence (mirrors _phase_a_join in webhook.py):

    Step 1 — Backend text welcome         (0s gap before step 2)
    Step 2 — Backend media (Namaste+image)(5s gap before step 3)
    Step 3 — TPL_BATCH_1_IMAGE            (7s gap before step 4)
    Step 4 — TPL_BATCH_2_LIST
    """

    # ── Date calculation ──────────────────────────────────────────────────
    now_ist = datetime.now(IST)
    def _suffix(d):
        return "th" if 11 <= d <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(d % 10, "th")
    dynamic_date = f"{now_ist.day}{_suffix(now_ist.day)} {now_ist.strftime('%B')}"

    # ── Step 1: Backend plain text welcome ────────────────────────────────
    msg_welcome = (
        f"Welcome {USER_NAME} Ji, let's start! 🚀\n\n"
        f"Your 14-Day FREE YOGA Journey\n"
        f"Starts {dynamic_date} 😄🧘"
    )
    print("⏳ [1/4] Sending Backend Welcome text...")
    await send_whatsapp_message(USER_PHONE, msg_welcome)

    # ── Step 2: Backend media (Namaste text + image) — 0s gap ────────────
    msg_namaste = (
        f"Namaste {USER_NAME} Ji! 🙏✨\n"
        "Welcome to the Praan Health family! 🌿\n\n"
        "We are honored to guide you through your 14-Day Senior Strength & Mobility Trial. 🚶‍♂️💪 \n"
        "Our physician-backed program is designed to gently reduce joint pain, improve your balance, \n"
        "and help you move with confidence. 🌈🧘‍♂️\n\n"
        "Your journey to a healthier, pain-free life starts right now! 🌼🌞\n"
        "---\n"
        "Praan Health - Care for your parents."
    )
    hero_image_url = "https://raw.githubusercontent.com/vaibuzz/Loan-approval-ML-project-/main/WhatsApp%20Image%202026-04-17%20at%2012.23.24%20AM.jpeg"
    print("⏳ [2/4] Sending Backend media (Namaste text + image)...")
    try:
        await send_whatsapp_media_message(USER_PHONE, msg_namaste, hero_image_url)
        print("✅ [2/4] Media message sent!")
    except Exception as e:
        print(f"❌ [2/4] Media message FAILED: {e}")

    # ── Step 3: TPL_BATCH_1_IMAGE — 5s gap ───────────────────────────────
    print("⏳ [3/4] Waiting 10s then sending TPL_BATCH_1_IMAGE...")
    await asyncio.sleep(10.0)
    tpl_batch_1_sid = os.getenv("TPL_BATCH_1_IMAGE")
    print(f"        SID = {tpl_batch_1_sid}")
    try:
        await send_whatsapp_template(USER_PHONE, tpl_batch_1_sid, [])
        print("✅ [3/4] TPL_BATCH_1_IMAGE sent!")
    except Exception as e:
        print(f"❌ [3/4] TPL_BATCH_1_IMAGE FAILED: {e}")

    # ── Step 4: TPL_BATCH_2_LIST — 7s gap ────────────────────────────────
    print("⏳ [4/4] Waiting 7s then sending TPL_BATCH_2_LIST...")
    await asyncio.sleep(7.0)
    tpl_batch_2_sid = os.getenv("TPL_BATCH_2_LIST")
    print(f"        SID = {tpl_batch_2_sid}")
    try:
        await send_whatsapp_template(USER_PHONE, tpl_batch_2_sid, [])
        print("✅ [4/4] TPL_BATCH_2_LIST sent!")
    except Exception as e:
        print(f"❌ [4/4] TPL_BATCH_2_LIST FAILED: {e}")


def main():
    print("=" * 60)
    print("  PRAAN HEALTH — Onboarding Sequence Test")
    print("  Sends 4 messages total (~15s sequence)")
    print("=" * 60)

    input("\n📌 Press Enter to trigger the full join sequence...")
    asyncio.run(run_full_sequence())

    print("\n" + "=" * 60)
    print("🎉 Done! Check your phone for all 4 messages.")
    print("   Phases C/D/E are triggered by button clicks")
    print("   on your live webhook (no test script needed).")
    print("=" * 60)


if __name__ == "__main__":
    main()
