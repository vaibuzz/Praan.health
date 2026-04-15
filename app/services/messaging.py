"""
app/services/messaging.py
--------------------------
Twilio WhatsApp abstraction layer.

send_whatsapp_template(to_number, template_id, variables_dict)
  - to_number    : E.164 phone number (e.g. "+919876543210")
  - template_id  : logical key defined in config.TEMPLATE_IDS
  - variables_dict : list or dict of values; mapped to keys {{2}}, {{3}}, … to match
                     the Praan template convention (name is always {{2}})

The function is synchronous (Twilio's SDK is sync) but wrapped so it can be
awaited by running it in the default thread-pool executor.
"""

import asyncio
import logging
from functools import partial

from twilio.rest import Client

import app.core.config as cfg

logger = logging.getLogger(__name__)

_twilio_client: Client | None = None


def _get_twilio_client() -> Client:
    global _twilio_client
    if _twilio_client is None:
        _twilio_client = Client(cfg.TWILIO_ACCOUNT_SID, cfg.TWILIO_AUTH_TOKEN)
    return _twilio_client


def _send_sync(to_number: str, template_id: str, variables: list | dict) -> str:
    """
    Synchronous Twilio call. Uses Content API (content_sid) for approved templates.
    Falls back to a plain text message body when no real SID is configured
    (useful for local development / sandboxing).
    """
    client = _get_twilio_client()
    to_wa = f"whatsapp:{to_number}" if not to_number.startswith("whatsapp:") else to_number
    resolved_sid = cfg.TEMPLATE_IDS.get(template_id, template_id)

    # Build the variable substitutions expected by Twilio Content API.
    # - dict  → use the caller's explicit keys as-is (e.g. {"1": name, "2": day})
    # - list  → auto-number starting at 2 (Praan convention: {{2}} = name)
    if isinstance(variables, dict):
        content_variables = {str(k): v for k, v in variables.items()}
    elif isinstance(variables, list):
        content_variables = {str(i + 2): v for i, v in enumerate(variables)}
    else:
        content_variables = {}

    import json
    try:
        message = client.messages.create(
            from_=cfg.TWILIO_WHATSAPP_FROM,
            to=to_wa,
            content_sid=resolved_sid,
            content_variables=json.dumps(content_variables) if content_variables else None,
        )
        logger.info(
            "WhatsApp message sent sid=%s to=%s template=%s",
            message.sid,
            to_number,
            template_id,
        )
        return message.sid
    except Exception as exc:  # noqa: BLE001
        logger.error(
            "Failed to send WhatsApp template=%s to=%s: %s",
            template_id,
            to_number,
            exc,
        )
        raise


async def send_whatsapp_template(
    to_number: str,
    template_id: str,
    variables: list | dict | None = None,
) -> str:
    """
    Async wrapper for _send_sync so callers can simply `await` it.
    Runs the blocking Twilio SDK in a thread-pool executor.
    """
    loop = asyncio.get_event_loop()
    fn = partial(_send_sync, to_number, template_id, variables or [])
    return await loop.run_in_executor(None, fn)
