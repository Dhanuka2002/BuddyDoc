import sys
import types
import pytest
from fastapi import FastAPI, Depends
from httpx import AsyncClient, ASGITransport


@pytest.mark.asyncio
async def test_get_current_user_with_mocked_firebase():
    # Prepare a fake firebase_admin module with auth.verify_id_token
    fake_module = types.ModuleType("firebase_admin")
    fake_auth = types.SimpleNamespace()

    def fake_verify_id_token(token: str):
        # simple mock: any token returns this payload
        return {"uid": "test-user", "email": "test@example.com"}

    fake_auth.verify_id_token = fake_verify_id_token
    # attach auth submodule to fake module
    fake_module.auth = fake_auth

    # Insert into sys.modules before importing the dependency so import succeeds
    sys.modules["firebase_admin"] = fake_module
    sys.modules["firebase_admin.auth"] = fake_auth

    # Now import the dependency from the project
    from common.auth import get_current_user

    app = FastAPI()

    @app.get("/protected")
    def protected(user=Depends(get_current_user)):
        return {"ok": True, "uid": user["uid"]}

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = {"Authorization": "Bearer dummy-token"}
        resp = await ac.get("/protected", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["ok"] is True
        assert data["uid"] == "test-user"
