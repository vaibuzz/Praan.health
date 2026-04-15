"""
app/api/webhook.py
-------------------
Twilio WhatsApp Webhook Implementation
"""

import logging

from fastapi import APIRouter, Form, Request, BackgroundTasks
from fastapi.responses import JSONResponse, Response

from app.core.database import get_supabase
from app.services.messaging import send_whatsapp_template
from app.services.user_service import set_preferred_time, update_user_step, get_user

logger = logging.getLogger(__name__)
router = APIRouter()

TWIML_OK = "<Response></Response>"

def _today_ist():
    from datetime import datetime
    from zoneinfo import ZoneInfo
    return datetime.now(ZoneInfo("Asia/Kolkata")).date()

@router.post("/twilio_webhook")
async def handle_twilio_webhook(
    background_tasks: BackgroundTasks,
    request: Request,
    Body: str = Form(None),
    From: str = Form(None),
    ButtonText: str = Form(None),
    ListId: str = Form(None), # This captures List Picker IDs
    ButtonPayload: str = Form(None) # This captures Quick Reply IDs
):
    if not From:
        return Response(content=TWIML_OK, media_type="text/xml")
        
    user_phone = From.replace("whatsapp:", "").strip()
    
    # Identify which button or list item was clicked
    # We prioritize the ID over the text to avoid language/spacing issues
    action_id = ListId or ButtonPayload or Body

    if not action_id:
        return Response(content=TWIML_OK, media_type="text/xml")
        
    action_id = action_id.strip()

    db = await get_supabase()
    user = await get_user(db, user_phone)
    
    if not user:
        logger.warning("Received message from unknown number: %s", user_phone)
        return Response(content=TWIML_OK, media_type="text/xml")

    name = user.get("name", "friend")
    logger.info("Webhook from %s | action='%s'", user_phone, action_id)

    # 1. HANDLE STEP 1 -> STEP 2 (Welcome -> Batch Selector)
    if action_id == "onboarding_step_2":
        import asyncio
        # Send Schedule Image (Template 2A)
        background_tasks.add_task(
            send_whatsapp_template, user_phone, "tpl_batch_1_image", []
        )
        # Strict 2-second asynchronous delay to prevent API racing
        await asyncio.sleep(2)
        # Send List Picker (Template 2B)
        background_tasks.add_task(
            send_whatsapp_template, user_phone, "tpl_batch_2_list", []
        )
        await update_user_step(db, user_phone, "batch_selection")

    # 2. HANDLE BATCH SELECTION (Updating Database)
    elif "batch_" in action_id:
        try:
            batch_time = action_id.split("_")[1] # Extracts 0630, 1700, etc.
        except IndexError:
            batch_time = action_id
            
        # Update Supabase 'preferred_time' for this user_phone
        today = _today_ist()
        session_type = "morning" if batch_time.startswith(("0", "10", "11")) else "evening"
        
        await set_preferred_time(db, user_phone, today, session_type, batch_time)
        await update_user_step(db, user_phone, "onboarding_complete")

        # Trigger Orientation (Step 3) - Uses {{1}} as "Vaibhav" or actual name
        background_tasks.add_task(
            send_whatsapp_template, user_phone, "tpl_orientation", [name]
        )

    # 3. HANDLE STEP 3 -> STEP 4 (Orientation -> Invite & Confirm)
    elif action_id == "onboarding_step_4":
        import asyncio
        from datetime import datetime
        from app.core.config import IST

        # 1. Send the Invite wrapper (Uses {{1}}: name, {{2}}: phone as referral ID)
        background_tasks.add_task(
            send_whatsapp_template, user_phone, "tpl_step_4_invite", [name, user_phone]
        )

        # 2. Add an elegant pause so messages arrive in strict order
        background_tasks.add_task(asyncio.sleep, 2)

        # 3. Time Calculation for "Today" vs "Tomorrow"
        day_string = "Tomorrow"
        batch_time_formatted = "your selected time"
        
        pref_time_str = user.get("preferred_time")
        if pref_time_str and len(pref_time_str) == 4:
            try:
                pref_hour = int(pref_time_str[:2])
                pref_min = int(pref_time_str[2:])
                now_ist = datetime.now(IST)

                # Format time nicely (e.g. "0730" -> "7:30 AM")
                batch_time_obj = datetime.strptime(pref_time_str, "%H%M")
                batch_time_formatted = batch_time_obj.strftime("%I:%M %p").lstrip("0")

                # If current time is strictly before the preferred time today, it's Today!
                if now_ist.hour < pref_hour or (now_ist.hour == pref_hour and now_ist.minute < pref_min):
                    day_string = "Today"
            except ValueError:
                pass # Fallback to default if parsing fails

        # 4. Send Confirmation Message — uses {{1}}=name, {{2}}=day, {{3}}=time
        background_tasks.add_task(
            send_whatsapp_template, user_phone, "tpl_next_session_confirm",
            {"1": name, "2": day_string, "3": batch_time_formatted}
        )

    # 4. HANDLE FEEDBACK BUTTONS
    elif "feedback_" in action_id:
        replies = {
            "feedback_1": "That is wonderful to hear! Consistency is key.",
            "feedback_2": "It's normal to feel tired. Your body is growing stronger!",
            "feedback_3": "Listen to your body. Stick to gentle breathing tomorrow."
        }
        reply_text = replies.get(action_id, "Thank you for the feedback!")
        
        # Send the Feedback Wrapper Template (Uses {{1}} for the reply)
        background_tasks.add_task(
            send_whatsapp_template, user_phone, "tpl_feedback_reply", [reply_text]
        )

    return Response(content=TWIML_OK, media_type="text/xml")

