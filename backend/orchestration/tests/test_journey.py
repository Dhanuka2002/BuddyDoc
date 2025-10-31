import pytest
from httpx import AsyncClient, ASGITransport
from main import app
import os


@pytest.mark.asyncio
async def test_journey_crud(monkeypatch, tmp_path):
    # ensure orchestration secret is set for dependency bypass in tests
    os.environ['BUDDYDOC_ORCH_SECRET'] = 'test-secret'

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        user_id = 'user-123'
        body = {"title": "Visit A", "date": "2025-10-31", "location": "Clinic 1", "note": "Checked"}

        # create
        resp = await ac.post(f"/api/v1/journey/{user_id}/events", json=body, headers={"Authorization": "Bearer test-secret"})
        assert resp.status_code == 200
        created = resp.json()
        assert created.get('id')

        event_id = created['id']

        # list
        resp = await ac.get(f"/api/v1/journey/{user_id}", headers={"Authorization": "Bearer test-secret"})
        assert resp.status_code == 200
        items = resp.json()
        assert any(i['id'] == event_id for i in items)

        # patch
        patch = {"note": "Updated note"}
        resp = await ac.patch(f"/api/v1/journey/{user_id}/events/{event_id}", json=patch, headers={"Authorization": "Bearer test-secret"})
        assert resp.status_code == 200
        updated = resp.json()
        assert updated['note'] == 'Updated note'

        # delete
        resp = await ac.delete(f"/api/v1/journey/{user_id}/events/{event_id}", headers={"Authorization": "Bearer test-secret"})
        assert resp.status_code == 200
        assert resp.json().get('ok') is True
