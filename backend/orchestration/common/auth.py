import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Any, Dict

_security = HTTPBearer(auto_error=False)


def _get_firebase_auth():
    """Lazy import firebase_admin.auth to avoid import-time errors in tests.

    Returns the firebase_admin.auth module or None if firebase_admin is not installed.
    """
    try:
        from firebase_admin import auth as firebase_auth  # type: ignore

        return firebase_auth
    except Exception:
        return None


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(_security)) -> Dict[str, Any]:
    """FastAPI dependency that verifies a Firebase ID token and returns a user dict.

    Raises HTTPException(401) for missing/invalid tokens, or 500 if SDK not configured.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Missing authorization token")

    token = credentials.credentials
    firebase_auth = _get_firebase_auth()
    if firebase_auth is None:
        raise HTTPException(status_code=500, detail="Authentication SDK not configured on server")

    try:
        decoded = firebase_auth.verify_id_token(token)
        uid = decoded.get("uid") if isinstance(decoded, dict) else None
        if not uid:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"uid": uid, "claims": decoded}
    except HTTPException:
        raise
    except Exception:
        # Any verification error treated as unauthorized
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_user_or_secret(credentials: HTTPAuthorizationCredentials = Depends(_security)) -> Dict[str, Any]:
    """Allow either a configured orchestration secret or a Firebase ID token.

    Priority:
    - If BUDDYDOC_ORCH_SECRET is set and the incoming Bearer token matches it, return a simple dict.
    - Otherwise, attempt Firebase ID token verification (same behaviour as get_current_user).
    """
    orch_secret = os.getenv("BUDDYDOC_ORCH_SECRET")

    if orch_secret and credentials and credentials.credentials == orch_secret:
        return {"auth_method": "orch_secret"}

    # Fall back to Firebase verification
    return await get_current_user(credentials)
