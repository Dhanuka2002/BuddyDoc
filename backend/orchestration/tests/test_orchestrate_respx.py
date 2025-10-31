import json

import json

import pytest
import respx
from httpx import Response
from httpx import AsyncClient, ASGITransport

from main import app, AGENT_URLS


@pytest.mark.asyncio
async def test_orchestrate_with_respx(monkeypatch):
    # Prepare mocked agent responses using respx
    for url in AGENT_URLS:
        respx.post(url).mock(
            return_value=Response(200, json={
                "agent_id": url.split(':')[-1],
                "type": "reply",
                "text": f"mocked from {url}",
                "confidence": 0.9,
                "metadata": {},
            })
        )

    # Run orchestrator request; respx intercepts outgoing httpx calls
    async with respx.mock:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url='http://test') as ac:
            body = {"messages": [{"text": "respx test"}]}
            # set orchestration secret and include Authorization header
            import os
            os.environ['BUDDYDOC_ORCH_SECRET'] = 'test-secret'
            headers = {"Authorization": "Bearer test-secret"}
            resp = await ac.post('/api/v1/orchestrate', json=body, headers=headers)
            assert resp.status_code == 200
            data = resp.json()
            assert data['ok'] is True
            assert len(data['agent_responses']) == len(AGENT_URLS)
            for ar in data['agent_responses']:
                assert 'reply' in ar
                assert 'agent_id' in ar['reply']
                assert ar['reply']['text'].startswith('mocked from')