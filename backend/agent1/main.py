from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()
# Do not import the OpenAI SDK at module import time to allow this service to
# run without the `openai` package installed. When USE_OPENAI is enabled we
# import it lazily inside the request handler.
openai_api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="BuddyDoc Agent 1")

# Configure CORS origins from environment for local dev. Example:
# BUDDYDOC_CORS_ORIGINS="http://localhost:19006,http://127.0.0.1:19006"
allowed = os.getenv(
    "BUDDYDOC_CORS_ORIGINS",
    "http://localhost:19006,http://127.0.0.1:19006,http://localhost:19000",
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


class AgentRequest(BaseModel):
    text: str


@app.post("/api/v1/respond")
def respond(req: AgentRequest):
    # If OpenAI integration is enabled via env, call the LLM and return output.
    use_openai = os.getenv("USE_OPENAI", "0") == "1"
    if use_openai and openai_api_key:
        try:
            # Lazy import to avoid requiring the SDK when not used.
            import openai as _openai

            _openai.api_key = openai_api_key
            model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
            completion = _openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that provides concise medical suggestions when asked."},
                    {"role": "user", "content": req.text},
                ],
                temperature=0.2,
                max_tokens=512,
            )
            text = ""
            if completion and completion.get("choices"):
                ch = completion["choices"][0]
                msg = ch.get("message") or {}
                text = msg.get("content") or ch.get("text") or ""
                text = text.strip()
            if not text:
                text = f"[Agent1] (LLM returned empty) {req.text}"
            reply = {
                "agent_id": "agent1",
                "type": "reply",
                "text": text,
                "confidence": 0.6,
                "metadata": {"source": "openai"},
            }
            return reply
        except Exception as e:
            # Fall back to deterministic mock reply on error
            reply = {
                "agent_id": "agent1",
                "type": "reply",
                "text": f"[Agent1] (fallback) I processed: {req.text}",
                "confidence": 0.5,
                "metadata": {"error": str(e)},
            }
            return reply

    # Default mock reply when no LLM key/config is provided
    reply = {
        "agent_id": "agent1",
        "type": "reply",
        "text": f"[Agent1] I processed: {req.text}",
        "confidence": 0.8,
        "metadata": {},
    }
    return reply


@app.get("/")
def root():
    return {"status": "ok", "service": "agent1", "routes": ["/api/v1/respond", "/health"]}


@app.get("/health")
def health():
    return {"status": "pass", "agent_id": "agent1"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8101)
