import asyncio
import json

import asyncio
import json

import pytest
from httpx import AsyncClient, ASGITransport

from main import app
import os


@pytest.mark.asyncio
async def test_orchestrate_patches_agents(monkeypatch):
    # Patch call_agent_with_retries to return predictable responses
    async def fake_call(url, payload):
        return {
            "agent_url": url,
            "response": {
                "agent_id": url.split(':')[-1],
                "type": "reply",
                "text": f"echo: {payload.get('text')}",
                "confidence": 0.9,
                "metadata": {},
            },
        }

    monkeypatch.setattr('main.call_agent_with_retries', fake_call)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        body = {"messages": [{"text": "integration test"}]}
        # Set an orchestration secret for test-run and include Authorization header
        os.environ['BUDDYDOC_ORCH_SECRET'] = 'test-secret'
        headers = {"Authorization": "Bearer test-secret"}
        resp = await ac.post('/api/v1/orchestrate', json=body, headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data['ok'] is True
        assert data['input'] == 'integration test'
        assert isinstance(data['agent_responses'], list)
        # Each response should include a reply dict with standardized keys
        for ar in data['agent_responses']:
            assert 'reply' in ar
            r = ar['reply']
            assert 'agent_id' in r and 'text' in r and 'confidence' in r