from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import os

app = FastAPI(title="BuddyDoc Agent 2 - Disease Predictor")

# simple CORS for local dev
allowed = os.getenv("BUDDYDOC_CORS_ORIGINS", "http://localhost:19006,http://127.0.0.1:19006")
origins = [o.strip() for o in allowed.split(',') if o.strip()]
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


class AgentResponse(BaseModel):
    agent_id: str
    type: str
    text: str
    confidence: float
    metadata: Dict[str, Any]


def heuristic_predict(symptom_text: str) -> List[Dict[str, Any]]:
    """Simple keyword-based heuristic mapping symptoms -> likely diseases.

    Returns a list of predictions with confidence scores.
    """
    s = symptom_text.lower()
    predictions = []

    # Rule examples (expand later)
    if any(k in s for k in ["fever", "temperature", "chills"]):
        predictions.append({"disease": "Infection (unspecified)", "confidence": 0.6})
    if any(k in s for k in ["cough", "sore throat", "phlegm"]):
        predictions.append({"disease": "Upper respiratory infection", "confidence": 0.55})
    if any(k in s for k in ["headache", "migraine", "throbbing"]):
        predictions.append({"disease": "Tension-type headache / migraine", "confidence": 0.5})
    if any(k in s for k in ["abdominal", "stomach", "nausea"]):
        predictions.append({"disease": "Gastrointestinal upset", "confidence": 0.5})
    if any(k in s for k in ["rash", "itch", "erythema"]):
        predictions.append({"disease": "Dermatologic reaction", "confidence": 0.45})

    # If no rules matched, provide a safe fallback
    if not predictions:
        predictions.append({"disease": "Non-specific symptoms - further history required", "confidence": 0.3})

    # Normalize confidences a bit
    total = sum(p['confidence'] for p in predictions)
    if total > 0:
        for p in predictions:
            p['confidence'] = round(p['confidence'] / max(total, 1.0), 2)

    return predictions


@app.post('/api/v1/respond', response_model=AgentResponse)
def respond(req: AgentRequest):
    preds = heuristic_predict(req.text)
    # Create a compact text summary
    top = preds[0]
    summary = f"Top prediction: {top['disease']} (confidence {top['confidence']})"
    metadata = {"predictions": preds}

    return {
        "agent_id": "agent2",
        "type": "prediction",
        "text": summary,
        "confidence": float(preds[0].get('confidence', 0.0)),
        "metadata": metadata,
    }


@app.get('/')
def root():
    return {"status": "ok", "service": "agent2", "routes": ["/api/v1/respond", "/health"]}


@app.get('/health')
def health():
    return {"status": "pass", "agent_id": "agent2"}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', host='127.0.0.1', port=int(os.getenv('PORT', 8102)))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import os

app = FastAPI(title="BuddyDoc Agent 2")

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
    # Standardized response schema for agents
    reply = {
        "agent_id": "agent2",
        "type": "reply",
        "text": f"[Agent2] Suggestion based on: {req.text}",
        "confidence": 0.75,
        "metadata": {},
    }
    return reply


@app.get("/")
def root():
    return {"status": "ok", "service": "agent2", "routes": ["/api/v1/respond", "/health"]}


@app.get("/health")
def health():
    return {"status": "pass", "agent_id": "agent2"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8102)
