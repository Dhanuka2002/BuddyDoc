import pytest
from httpx import AsyncClient, ASGITransport

from main import app


@pytest.mark.asyncio
async def test_agent2_predict():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        body = {"text": "I have fever and cough"}
        resp = await ac.post('/api/v1/respond', json=body)
        assert resp.status_code == 200
        data = resp.json()
        assert data['agent_id'] == 'agent2'
        # agent may report type 'prediction' or 'reply' depending on implementation
        assert data['type'] in ('prediction', 'reply')
    metadata = data.get('metadata') or {}
    preds = metadata.get('predictions') or []
    assert isinstance(preds, list)
    assert len(preds) >= 1
