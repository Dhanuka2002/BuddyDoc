import os
import asyncio
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv
from common.auth import get_current_user_or_secret

load_dotenv()

app = FastAPI(title="BuddyDoc Orchestration Agent")

# Configure CORS from env or allow common local dev origins
allowed = os.getenv(
    "BUDDYDOC_CORS_ORIGINS",
    "http://localhost:19006,http://127.0.0.1:19006,http://localhost:19000"
)
origins = [o.strip() for o in allowed.split(",") if o.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include journey router
from journey import router as journey_router
app.include_router(journey_router, prefix="/api/v1/journey")

AGENT_URLS = [
    os.getenv("BUDDYDOC_AGENT1_URL", "http://127.0.0.1:8101/api/v1/respond"),
    os.getenv("BUDDYDOC_AGENT2_URL", "http://127.0.0.1:8102/api/v1/respond"),
]

ORCH_SECRET = os.getenv("BUDDYDOC_ORCH_SECRET")


class ChatMessage(BaseModel):
    user_id: Optional[str] = None
    text: str
    metadata: Optional[Dict[str, Any]] = None


class OrchestrateRequest(BaseModel):
    messages: List[ChatMessage]


async def call_agent_with_retries(url: str, payload: Dict[str, Any]):
    max_retries = int(os.getenv("BUDDYDOC_AGENT_MAX_RETRIES", "2"))
    backoff = float(os.getenv("BUDDYDOC_AGENT_BACKOFF", "0.5"))
    agent_timeout = float(os.getenv("BUDDYDOC_AGENT_TIMEOUT", "8.0"))

    last_err = None
    for attempt in range(max_retries + 1):
        try:
            timeout = httpx.Timeout(agent_timeout)
            async with httpx.AsyncClient(timeout=timeout) as client:
                r = await client.post(url, json=payload)
                r.raise_for_status()
                return {"agent_url": url, "response": r.json()}
        except Exception as e:
            last_err = str(e)
            if attempt < max_retries:
                # simple exponential backoff
                await asyncio.sleep(backoff * (2 ** attempt))
                continue
            return {"agent_url": url, "error": last_err}


@app.post("/api/v1/orchestrate")
async def orchestrate(req: OrchestrateRequest, authorization: str | None = Header(None), user: dict = Depends(get_current_user_or_secret)):
    # auth handled by get_current_user_or_secret dependency which accepts either
    # the orchestration secret (BUDDYDOC_ORCH_SECRET) or a Firebase ID token.

    if not req.messages:
        raise HTTPException(status_code=400, detail="no messages provided")

    latest = req.messages[-1].text
    payload = {"text": latest}

    tasks = [call_agent_with_retries(u, payload) for u in AGENT_URLS]
    results = await asyncio.gather(*tasks)

    responses = []
    for res in results:
        if res.get("error"):
            responses.append({"agent": res["agent_url"], "error": res["error"]})
        else:
            agent_resp = res.get("response")
            # Expect standardized agent response schema
            if isinstance(agent_resp, dict) and agent_resp.get("agent_id"):
                responses.append({"agent": res["agent_url"], "reply": {
                    "agent_id": agent_resp.get("agent_id"),
                    "type": agent_resp.get("type"),
                    "text": agent_resp.get("text"),
                    "confidence": agent_resp.get("confidence"),
                    "metadata": agent_resp.get("metadata", {}),
                }})
            else:
                # Fallback: include raw response
                responses.append({"agent": res["agent_url"], "reply": {"raw": agent_resp}})

    return {"ok": True, "input": latest, "agent_responses": responses}


@app.get("/")
async def root():
    return {"status": "ok", "service": "buddydoc-orchestration", "routes": ["/api/v1/orchestrate", "/docs", "/redoc", "/health"]}


@app.get("/health")
async def health():
    out = {"status": "pass", "agents": []}
    async with httpx.AsyncClient(timeout=httpx.Timeout(2.0)) as client:
        for url in AGENT_URLS:
            try:
                r = await client.post(url, json={"text": "healthcheck"})
                if r.status_code == 200:
                    out["agents"].append({"agent": url, "ok": True})
                else:
                    out["agents"].append({"agent": url, "ok": False, "status": r.status_code})
            except Exception as e:
                out["agents"].append({"agent": url, "ok": False, "error": str(e)})
    return out


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
