## Agents architecture, orchestration and file structure

This document describes the planned agent architecture for BuddyDoc (two worker agents + one orchestration agent), the API design, expected data shapes, security notes, and a suggested file structure (visual tree) for the repository. It's written for a beginner and includes actionable next steps.

---

## 1) High-level overview

- Frontend: React Native (Expo) app with an agentic chat UI. The UI sends user's chat messages to the Orchestration API.
- Orchestration: Python FastAPI service that accepts chat messages, calls Agent A and Agent B concurrently, aggregates results and returns them to the frontend.
- Agent A: rule-based local agent (fast, deterministic) — useful for extracting structured data (symptoms, meds) and prompting missing fields.
- Agent B: LLM-backed agent (cloud or local) — used for natural language summarization, question suggestions, and phrasing.

Privacy note: by default, keep sensitive patient data (PHI) on-device. If Agent B uses cloud LLMs, require explicit user consent and show clear disclaimers.

---

## 2) API design (orchestration)

### POST /orchestrator/chat

Request JSON
```json
{
  "user_id": "string (optional)",
  "session_id": "string (optional, server can create)",
  "message": "string",
  "context": { "history": [] }
}
```

Response JSON
```json
{
  "session_id": "string",
  "reply": "aggregated reply text",
  "sources": [
    { "agent": "A", "text": "..." },
    { "agent": "B", "text": "..." }
  ],
  "meta": { "latency_ms": 123 }
}
```

### WebSocket (optional, streaming)

- ws `/ws/orchestrator/{session_id}`
- Client sends `{ "type": "user_message", "message": "..." }`.
- Server streams chunks: `{ "type":"chunk","agent":"A","text":"partial..." }`.
- Final message: `{ "type":"done","reply":"full text","sources": [...] }`.

---

## 3) Agent interface (Python)

Each agent should implement a simple async interface:

```py
async def respond(message: str, context: dict) -> dict:
    return {
        "agent": "A",
        "text": "response text",
        "confidence": 0.9,
        "metadata": {"sources": []}
    }
```

The orchestrator calls both agents concurrently and applies a policy (pick higher confidence, merge, or fallback).

---

## 4) Orchestration policy examples

- Simple merge (MVP): call both agents concurrently, return concatenated answers with tags.
- Confidence-based pick: use `confidence` field from agents and return the highest.
- Rule-first fallback: run Agent A (fast). If its confidence < threshold, call Agent B.

---

## 5) Security & privacy checklist

- Default: PHI stays on the device. Do NOT send raw PHI to cloud LLMs unless user explicitly opts in.
- Use HTTPS for backend endpoints.
- Authenticate clients (Firebase Auth or JWT) before allowing agent orchestration.
- Rate-limit API endpoints and apply input sanitization.
- Store minimal logs. Avoid storing user messages in logs or store them encrypted when necessary.

---

## 6) Implementation plan (incremental)

Phase 1 — skeleton (1–2 days)
- Add orchestrator router in `backend-python` with POST `/orchestrator/chat` that calls two agent stubs.
- Add agents stubs: `backend-python/app/agents/agent_a.py` and `agent_b.py`.
- Add unit smoke tests for the orchestration flow.

Phase 2 — frontend integration (1–2 days)
- Add a chat screen in `frontend/src/screens/ChatScreen.tsx`.
- Implement a small API client to POST to `/orchestrator/chat` and show replies.

Phase 3 — improve agents (2–4 days)
- Implement Agent A rule-based extractor (symptom fields).
- Implement Agent B with LLM calls (OpenAI or local); add config for API keys and opt-in flows.

Phase 4 — sessions, auth, and persistence (2+ days)
- Add session storage (Redis or in-memory for dev).
- Add auth (Firebase or JWT), CORS, and deployment configs.

---

## 7) File structure (current + recommended)

Below is a suggested directory tree for the repo. Files we already created are included; new files for orchestration and agents are marked as **(add)**.

```
BuddyDoc/
├─ .git/
├─ README.md
├─ requirements_explanation.md
├─ Business case 3(2).docx
├─ Business Case Template - 2 (1).docx
├─ Diagram.jpg
├─ frontend/
│  ├─ package.json
  │  ├─ tsconfig.json
  │  ├─ README.md
  │  ├─ .gitignore
  │  └─ src/
  │     ├─ App.tsx
  │     ├─ screens/
  │     │  └─ ChatScreen.tsx   # (add)
  │     └─ services/
  │        └─ orchestratorClient.ts # (add)
├─ backend/                      # (existing Node scaffold, optional)
│  └─ ...
├─ backend-python/
│  ├─ requirements.txt           # (add or restore)
│  ├─ README.md
│  ├─ .gitignore
│  └─ app/
│     ├─ main.py                 # FastAPI entry
│     ├─ routers/
│     │  ├─ health.py
│     │  ├─ symptoms.py
│     │  └─ medications.py
│     ├─ orchestrator.py         # (add) orchestration route & logic
│     └─ agents/
│        ├─ __init__.py
│        ├─ agent_a.py           # (add) rule-based
│        └─ agent_b.py           # (add) LLM-backed stub
└─ scripts/
   └─ extract_docx.py
```

Notes on files to add (`(add)`):
- `orchestrator.py` — main orchestration logic and API endpoint.
- `agent_a.py` — simple rule-based agent to extract structured fields and ask clarifying questions.
- `agent_b.py` — LLM-backed agent (wrap OpenAI or other provider); keep implementation behind an environment flag.
- `frontend/src/screens/ChatScreen.tsx` — chat UI screen that posts to `/orchestrator/chat` and shows replies and agent attributions.

---

## 8) Example minimal orchestrator (pseudocode)

```python
# orchestrator.py
import asyncio
from fastapi import APIRouter
from .agents import agent_a, agent_b

router = APIRouter()

@router.post("/orchestrator/chat")
async def orchestrate(payload: dict):
    msg = payload["message"]
    ctx = payload.get("context", {})

    task_a = asyncio.create_task(agent_a.respond(msg, ctx))
    task_b = asyncio.create_task(agent_b.respond(msg, ctx))

    done, pending = await asyncio.wait({task_a, task_b}, timeout=6)
    responses = [t.result() for t in done]
    for p in pending:
        p.cancel()

    # simple aggregation: join responses with attribution
    sources = [{"agent": r["agent"], "text": r["text"]} for r in responses]
    reply = "\n\n".join([f"[{s['agent']}] {s['text']}" for s in sources])

    return {"session_id": payload.get("session_id"), "reply": reply, "sources": sources}
```

---

## 9) Next actions I can take for you now

Pick one or more and I'll implement the files in the repo:

- `Scaffold orchestrator` — add `backend-python/app/orchestrator.py` and wire the route in `main.py`.
- `Add agent stubs` — create `agent_a.py` and `agent_b.py` with `respond()` stubs.
- `Add frontend chat screen` — create `ChatScreen.tsx` and a small API client to call the orchestrator.
- `Restore requirements.txt` — recreate `backend-python/requirements.txt` and a PowerShell setup script.

Reply with which items you want me to create and I'll add the files and update the todo list accordingly.

---

## 10) Recommended Tech Stack (your requested additions)

The following technologies are recommended for the project and map to the architecture above. Short notes explain the role of each and integration considerations (especially privacy for health data).

- Google Firebase (Auth): Use Firebase Authentication for user sign-up/sign-in, social providers, and token management. Works well with React Native and provides secure identity out of the box.
- Firestore (Cloud Firestore): Use Firestore for non-sensitive app configuration, public content, and optionally syncable user preferences. Do NOT store PHI (symptoms, notes) in Firestore unless you implement explicit opt-in encrypted backup and compliance reviews.
- Firebase Realtime / Cloud Messaging: Use Firebase Realtime Database or Firestore real-time listeners for low-latency UI updates; use Firebase Cloud Messaging (FCM) for appointment reminders and push notifications. Ensure notification payloads avoid PHI unless explicitly allowed by user consent.
- Vertex AI (Google Cloud): Use Vertex AI as the managed LLM/ML service (if you prefer Google Cloud LLMs). Vertex can host embedding models, text-generation models, and support fine-tuning. Call Vertex from the orchestration agent (server-side) or through LangChain connectors.
- LangChain: Use LangChain in the orchestration agent to orchestrate LLM calls, tool usage, prompt templates, memory management, and chaining multiple calls (e.g., extract -> summarize -> format). LangChain provides connectors for Vertex AI and other LLM providers and simplifies prompt orchestration and caching.
- Neo4j Aura (managed): Use Neo4j Aura DB for an ontology/knowledge graph to model relationships between symptoms, medications, conditions, and clinician notes. The orchestration agent can query Neo4j to enrich responses (e.g., find related symptoms or common medication interactions) and help the agent ground suggestions in structured knowledge.

Integration notes and privacy cautions:
- PHI boundary: keep PHI on-device by default. If you choose to use Vertex AI or other cloud LLMs, require explicit opt-in and encrypt data in transit. Consider sending only de-identified, redacted, or summarized user inputs to cloud LLMs where possible.
- LangChain + Vertex AI: Run LangChain in the orchestration backend; use a connector for Vertex AI to call LLMs. Cache embeddings locally or in a secure store to avoid repeated external calls.
- Neo4j for ontology: store a curated domain ontology (symptom categories, common questions, medication metadata) in Neo4j Aura. Avoid storing raw patient notes in the graph unless encrypted and with consent — instead store references/IDs to on-device data when needed.
- Firestore usage: Firestore is convenient for app settings, templates for agentic nudges, and non-sensitive analytics. Keep analytics non-PHI and aggregate where possible.
- Authentication & access control: Use Firebase Auth tokens to authenticate frontend calls to the orchestration API. On the orchestration side, validate the token, map to session_id, and enforce quotas and rate-limits per user.

Deployment considerations:
- Vertex AI and Neo4j Aura are managed services (paid). Use service accounts and IAM roles for Vertex AI access and network policies to restrict access.
- Keep orchestration agents and LangChain code on your FastAPI backend; centrally control which LLM endpoints are used and log requests for audit (avoid storing full PHI).

---

If you want, I can now:
- add a `backend-python/app/agents/langchain_vertex.py` stub showing how to call Vertex via LangChain, and a `backend-python/app/agents/neo4j_client.py` stub to query Neo4j Aura, or
- add Firebase integration notes and example code for verifying Firebase ID tokens in FastAPI.

Which of these would you like me to add next?
