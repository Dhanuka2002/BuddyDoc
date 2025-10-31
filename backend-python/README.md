# BuddyDoc Backend - Multi-Agent Orchestration System

## Architecture Overview

The BuddyDoc backend uses a **multi-agent orchestration pattern** with two specialized AI agents:

- **Agent A (Rule-Based)**: Fast, deterministic extraction of structured fields (symptoms, medications). Runs locally without external API calls.
- **Agent B (LLM-Backed)**: Contextual natural language advice using Google Vertex AI + LangChain. Requires user opt-in for PHI handling.
- **Orchestrator**: Coordinates both agents concurrently with 8-second timeout, aggregates responses.

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Web Framework | FastAPI 0.104.1 | REST API with async support |
| Server | Uvicorn (ASGI) | Production-ready async server |
| LLM Orchestration | LangChain 0.1.0 | Agent workflows, prompt templates |
| AI Model | Vertex AI (Gemini Pro) | Natural language generation |
| Graph Database | Neo4j Aura 5.14.1 | Medical ontology (symptoms, meds) |
| Authentication | Firebase Admin 6.3.0 | User auth & token verification |
| Data Store | Firestore | Non-PHI config, user preferences |
| Schema Validation | Pydantic 2.5.0 | Request/response models |

## Project Structure

```
backend-python/
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── orchestrator.py         # Multi-agent orchestration logic
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── agent_a.py          # Rule-based agent
│   │   └── agent_b.py          # LLM-backed agent
│   ├── routers/
│   │   └── health.py           # Health check endpoint
│   ├── clients/
│   │   ├── __init__.py
│   │   └── neo4j_client.py     # Neo4j graph queries
│   └── middleware/             # (Future: Firebase auth)
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
├── BACKEND_SETUP.md            # Setup instructions
└── README.md                   # This file
```

## API Endpoints

### 1. Root
```
GET /
Response: {"message": "BuddyDoc FastAPI backend with orchestrator is running"}
```

### 2. Health Check
```
GET /health/
Response: {"status": "ok", "service": "buddydoc-backend"}
```

### 3. Orchestrator Chat
```
POST /orchestrator/chat
Body: {
  "user_id": "string",
  "session_id": "string",
  "message": "string",
  "context": {
    "opt_in_llm": false,
    "language": "en"
  }
}
Response: {
  "reply": "string",
  "sources": ["AgentA", "AgentB"],
  "meta": {
    "agent_a_confidence": 0.9,
    "agent_b_confidence": 0.85,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Agent Interface

All agents implement the same async interface:

```python
async def respond(message: str, context: dict) -> dict:
    """
    Args:
        message: User's input text
        context: Dict with user preferences, opt-in flags, etc.
    
    Returns:
        {
            "agent": "A" or "B",
            "text": "response text",
            "confidence": 0.0 to 1.0,
            "metadata": {"key": "value"}
        }
    """
```

## Orchestration Flow

1. **Client sends** POST /orchestrator/chat with user message
2. **Orchestrator receives** request, validates with Pydantic
3. **Concurrent execution**: 
   - Starts Agent A task (asyncio)
   - Starts Agent B task (asyncio)
   - Waits for both with 8-second timeout
4. **Aggregation**: Combines responses with agent attribution
5. **Response sent** back to client with metadata

## Neo4j Ontology Schema

Expected graph structure (you'll need to populate):

```cypher
// Symptom nodes
CREATE (s:Symptom {name: "Fever", description: "Elevated body temperature"})
CREATE (s:Symptom {name: "Headache", description: "Pain in head region"})

// Medication nodes
CREATE (m:Medication {name: "Paracetamol", type: "Pain reliever"})

// Relationships
MATCH (s1:Symptom {name: "Fever"}), (s2:Symptom {name: "Headache"})
CREATE (s1)-[:RELATED_TO {frequency: "common"}]->(s2)
```

## Security Considerations

- **PHI stays on-device** by default (Agent A only)
- **Agent B requires explicit opt-in** via `context.opt_in_llm`
- **Firebase token verification** (TODO: add middleware)
- **CORS**: Currently set to `*` - restrict in production
- **Environment secrets**: Never commit `.env` file

## Configuration

Key environment variables (see `.env.example`):

```bash
# Google Cloud (for Vertex AI)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# Neo4j Aura
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_PASSWORD=your-password

# Firebase
FIREBASE_CREDENTIALS=/path/to/firebase-key.json

# Agent behavior
AGENT_TIMEOUT_SECONDS=8
ENABLE_LLM_AGENT=false  # Set true when GCP credentials ready
```

## Development Workflow

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Configure .env**: Copy `.env.example` and fill values
3. **Run server**: `uvicorn app.main:app --reload`
4. **Test API**: Visit http://localhost:8000/docs
5. **Iterate**: Code changes auto-reload with `--reload` flag

## Testing

```powershell
# Unit tests (TODO)
pytest tests/

# Integration test with curl
curl -X POST http://localhost:8000/orchestrator/chat `
  -H "Content-Type: application/json" `
  -d '{"user_id":"test","session_id":"s1","message":"I have fever"}'
```

## Future Enhancements

- [ ] Add Firebase auth middleware
- [ ] Implement streaming responses (WebSocket)
- [ ] Add session management with Firestore
- [ ] Implement agent memory/context window
- [ ] Add structured logging (JSON format)
- [ ] Containerize with Docker
- [ ] Add CI/CD pipeline
- [ ] Implement rate limiting
- [ ] Add performance monitoring (APM)

## License

Proprietary - BuddyDoc Team
