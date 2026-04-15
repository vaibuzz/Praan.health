"""
app/core/database.py
--------------------
Supabase client singleton using the Service Role Key (bypasses RLS).
All DB calls are async-compatible via supabase-py's async client.
"""

from supabase._async.client import AsyncClient, create_client

from app.core.config import SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL

_supabase_client: AsyncClient | None = None


async def get_supabase() -> AsyncClient:
    """Return (or lazily initialise) the shared async Supabase client."""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = await create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _supabase_client
