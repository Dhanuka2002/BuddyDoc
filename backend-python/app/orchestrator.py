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

    # Intelligent orchestration: pick best response or merge complementary ones
    # Filter out empty responses
    sources = [
        AgentSource(agent=r["agent"], text=r["text"], confidence=r.get("confidence"))
        for r in responses
        if r.get("text") and r["text"].strip()  # Only include non-empty responses
    ]
    
    # Sort by confidence (highest first)
    sorted_sources = sorted(sources, key=lambda x: x.confidence or 0, reverse=True)
    
    if not sorted_sources:
        reply = "I'm here to help. How can I assist you today?"
    elif len(sorted_sources) == 1:
        # Only one agent responded
        reply = sorted_sources[0].text
    else:
        # Multiple agents responded - use smart merging
        best = sorted_sources[0]
        second_best = sorted_sources[1]
        
        confidence_gap = (best.confidence or 0) - (second_best.confidence or 0)
        
        # If best agent has much higher confidence (>0.2), use only that response
        if confidence_gap > 0.2:
            reply = best.text
            logger.info(f"Using only best agent ({best.agent}) due to high confidence gap: {confidence_gap:.2f}")
        # If both have similar confidence and both are high (>0.7), merge them
        elif (best.confidence or 0) > 0.7 and (second_best.confidence or 0) > 0.7 and confidence_gap < 0.1:
            # Check if responses are significantly different (not generic)
            if len(best.text) > 100 and len(second_best.text) > 100:
                reply = best.text + "\n\n" + second_best.text
                logger.info(f"Merging both high-confidence responses")
            else:
                reply = best.text
                logger.info(f"Using best response, second too similar or generic")
        else:
            # Default: use best response only
            reply = best.text
            logger.info(f"Using best agent ({best.agent}) with confidence {best.confidence:.2f}")
    
    meta = {
        "count": len(sources),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    logger.info(f"Orchestration complete: {len(sources)} agents responded")

    return ChatResponse(session_id=session_id, reply=reply, sources=sources, meta=meta)
