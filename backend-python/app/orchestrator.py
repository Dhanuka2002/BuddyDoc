import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from .agents import agent_a, agent_b

router = APIRouter()


class ChatRequest(BaseModel):
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    message: str
    context: Optional[dict] = {}


class AgentSource(BaseModel):
    agent: str
    text: str
    confidence: Optional[float] = None


class ChatResponse(BaseModel):
    session_id: Optional[str]
    reply: str
    sources: List[AgentSource]
    meta: Optional[dict] = {}


@router.post("/chat", response_model=ChatResponse)
async def orchestrate_chat(payload: ChatRequest):
    """
    Orchestrator endpoint: calls Agent A (rule-based) and Agent B (LLM-backed)
    concurrently, aggregates responses, and returns to frontend.
    """
    import logging
    from datetime import datetime
    
    logger = logging.getLogger(__name__)
    
    msg = payload.message
    ctx = payload.context or {}
    session_id = payload.session_id or "default-session"
    
    logger.info(f"Chat request from user {payload.user_id}, session {session_id}")
    logger.debug(f"Message: {msg}")

    # Call both agents concurrently with timeout
    task_a = asyncio.create_task(agent_a.respond(msg, ctx))
    task_b = asyncio.create_task(agent_b.respond(msg, ctx))

    done, pending = await asyncio.wait({task_a, task_b}, timeout=8)

    responses = []
    for t in done:
        try:
            result = t.result()
            responses.append(result)
            logger.debug(f"Agent {result['agent']} responded with confidence {result.get('confidence')}")
        except Exception as e:
            logger.error(f"Agent error: {e}", exc_info=True)

    # Cancel pending tasks
    for p in pending:
        p.cancel()
        logger.warning(f"Agent task timed out and was cancelled")

    if not responses:
        logger.error("No agent responses received")
        raise HTTPException(status_code=500, detail="No agent responses received")

    # Simple orchestration policy: concatenate answers with agent attribution
    sources = [
        AgentSource(agent=r["agent"], text=r["text"], confidence=r.get("confidence"))
        for r in responses
    ]
    reply = "\n\n".join([f"[{s.agent}] {s.text}" for s in sources])
    
    meta = {
        "count": len(sources),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    logger.info(f"Orchestration complete: {len(sources)} agents responded")

    return ChatResponse(session_id=session_id, reply=reply, sources=sources, meta=meta)
