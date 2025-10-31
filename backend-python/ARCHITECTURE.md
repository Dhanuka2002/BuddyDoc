# Backend Architecture - Implementation Details

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Native Frontend                        │
│                    (Expo + TypeScript)                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/HTTPS
                            │ POST /orchestrator/chat
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                     FastAPI Backend                              │
│                  (Python 3.11+ / Uvicorn)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             Orchestrator (orchestrator.py)                │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │ Concurrent Agent Execution (asyncio.wait)        │   │  │
│  │  │ Timeout: 8 seconds                               │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                            │  │
│  │       ┌──────────────────┐      ┌──────────────────┐    │  │
│  │       │   Agent A        │      │   Agent B        │    │  │
│  │       │   (Rule-Based)   │      │   (LLM-Backed)   │    │  │
│  │       │                  │      │                  │    │  │
│  │       │ • Fast (0.3s)    │      │ • LangChain      │    │  │
│  │       │ • Local logic    │      │ • Vertex AI      │    │  │
│  │       │ • Keyword match  │      │ • Gemini Pro     │    │  │
│  │       │ • Confidence 0.9 │      │ • Confidence 0.85│    │  │
│  │       └──────────────────┘      └──────────────────┘    │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │ Response Aggregation                              │   │  │
│  │  │ • Concatenate with attribution                    │   │  │
│  │  │ • Collect confidence scores                       │   │  │
│  │  │ • Add metadata (timestamp, count)                │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
│  Neo4j Aura     │ │ Vertex AI    │ │ Firebase Admin  │
│  (Graph DB)     │ │ (Gemini Pro) │ │ (Auth + Store)  │
├─────────────────┤ ├──────────────┤ ├─────────────────┤
│ • Symptoms      │ │ • LLM calls  │ │ • User tokens   │
│ • Medications   │ │ • Prompts    │ │ • Firestore     │
│ • Relationships │ │ • Responses  │ │ • FCM           │
└─────────────────┘ └──────────────┘ └─────────────────┘
```

## File Structure

```
backend-python/
│
├── app/                          # Main application package
│   ├── main.py                   # FastAPI entry point
│   ├── orchestrator.py           # Multi-agent orchestration
│   ├── test_agents.py            # Agent testing utility
│   │
│   ├── agents/                   # Agent implementations
│   │   ├── __init__.py
│   │   ├── agent_a.py            # Rule-based agent
│   │   └── agent_b.py            # LLM-backed agent
│   │
│   ├── clients/                  # External service clients
│   │   ├── __init__.py
│   │   └── neo4j_client.py       # Neo4j graph queries
│   │
│   ├── models/                   # (Future: Pydantic models)
│   │
│   └── routers/                  # API endpoints
│       └── health.py             # Health check
│
├── requirements.txt              # Python dependencies
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── start.ps1                     # Quick start script
├── README.md                     # Architecture overview
├── BACKEND_SETUP.md              # Setup instructions
└── IMPLEMENTATION_SUMMARY.md     # This file
```

## Request/Response Flow

### 1. Chat Request
```json
POST /orchestrator/chat
{
  "user_id": "user123",
  "session_id": "session456",
  "message": "I have a fever and headache",
  "context": {
    "opt_in_llm": false,
    "language": "en"
  }
}
```

### 2. Orchestrator Processing
```
1. Validate request (Pydantic)
2. Create concurrent tasks:
   - task_a = agent_a.respond(msg, ctx)
   - task_b = agent_b.respond(msg, ctx)
3. Wait with 8s timeout
4. Collect completed responses
5. Cancel any pending tasks
6. Aggregate results
```

### 3. Agent A Response
```json
{
  "agent": "A",
  "text": "Consider logging when the symptom started and its severity (1-10).",
  "confidence": 0.9,
  "metadata": {"type": "rule-based"}
}
```

### 4. Agent B Response (Stub Mode)
```json
{
  "agent": "B",
  "text": "I'm here to help you prepare for your medical consultation. Could you tell me more about your symptoms or concerns?",
  "confidence": 0.85,
  "metadata": {"type": "llm", "model": "stub"}
}
```

### 5. Aggregated Response
```json
{
  "session_id": "session456",
  "reply": "[A] Consider logging when the symptom started and its severity (1-10).\n\n[B] I'm here to help you prepare for your medical consultation. Could you tell me more about your symptoms or concerns?",
  "sources": [
    {"agent": "A", "text": "...", "confidence": 0.9},
    {"agent": "B", "text": "...", "confidence": 0.85}
  ],
  "meta": {
    "count": 2,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Agent Interface Contract

All agents must implement:

```python
async def respond(message: str, context: dict) -> dict:
    """
    Process user message and return response.
    
    Args:
        message: User's input text
        context: Dictionary with:
            - opt_in_llm: bool (user consent for cloud processing)
            - language: str (e.g., "en", "si")
            - session_data: dict (previous interactions)
    
    Returns:
        {
            "agent": str,         # Agent identifier ("A", "B")
            "text": str,          # Response text
            "confidence": float,  # 0.0 to 1.0
            "metadata": dict      # Optional extra data
        }
    """
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `GOOGLE_CLOUD_PROJECT` | GCP project for Vertex AI | `buddydoc-prod-12345` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to GCP service account key | `/path/to/key.json` |
| `NEO4J_URI` | Neo4j Aura connection string | `neo4j+s://xyz.databases.neo4j.io` |
| `NEO4J_USER` | Neo4j username | `neo4j` |
| `NEO4J_PASSWORD` | Neo4j password | `your-password` |
| `FIREBASE_CREDENTIALS` | Path to Firebase Admin SDK key | `/path/to/firebase-key.json` |
| `FIREBASE_PROJECT_ID` | Firebase project identifier | `buddydoc-firebase` |
| `AGENT_TIMEOUT_SECONDS` | Max wait time for agents | `8` |
| `ENABLE_LLM_AGENT` | Enable/disable Agent B LLM | `false` |

## Deployment Checklist

### Development
- [x] FastAPI app structure
- [x] Multi-agent orchestration
- [x] Agent A rule-based logic
- [x] Agent B stub (LLM code ready)
- [x] Neo4j client
- [x] Health check endpoint
- [x] Error handling & logging
- [x] Documentation

### Staging
- [ ] Configure GCP credentials
- [ ] Set up Neo4j Aura instance
- [ ] Populate ontology data
- [ ] Configure Firebase project
- [ ] Enable Agent B LLM mode
- [ ] Test end-to-end with frontend
- [ ] Add Firebase auth middleware

### Production
- [ ] Restrict CORS origins
- [ ] Enable HTTPS/TLS
- [ ] Set up monitoring (APM)
- [ ] Configure structured logging
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Set up CI/CD pipeline
- [ ] Container orchestration (K8s/Cloud Run)

## Performance Considerations

| Component | Latency | Notes |
|-----------|---------|-------|
| Agent A | ~0.3s | Rule-based, always fast |
| Agent B (stub) | ~0.8s | Simulated LLM delay |
| Agent B (LLM) | 2-5s | Depends on prompt complexity |
| Neo4j query | <100ms | Graph queries are fast |
| Orchestrator overhead | <50ms | asyncio task management |
| **Total (both agents)** | **~1.1s stub / 3-6s LLM** | Concurrent execution |

## Security Model

```
┌────────────────────────────────────────────────────────────┐
│                    Data Classification                      │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  PHI (Protected Health Information)                         │
│  ├─ Symptoms, diagnoses, medications                        │
│  ├─ Personal identifiers                                    │
│  └─ Medical history                                         │
│                                                              │
│  Default: Processed by Agent A (on-device/local server)    │
│  With Opt-In: Processed by Agent B (Vertex AI)             │
│                                                              │
│  Non-PHI                                                    │
│  ├─ User preferences                                        │
│  ├─ App settings                                            │
│  └─ Session metadata                                        │
│                                                              │
│  Storage: Firebase Firestore (non-PHI only)                │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Monitoring & Logging

```python
# Logging levels used:
logging.info()    # Major events (request start/end, agent responses)
logging.debug()   # Detailed flow (agent calls, confidence scores)
logging.warning() # Timeouts, fallbacks
logging.error()   # Exceptions, failures
```

## Future Enhancements

1. **Streaming Responses**: WebSocket support for real-time agent output
2. **Agent Memory**: Maintain conversation context across requests
3. **Dynamic Agent Selection**: Choose agents based on query type
4. **Agent Registry**: Pluggable agent system with auto-discovery
5. **Caching**: Cache Neo4j queries and LLM responses
6. **A/B Testing**: Compare agent strategies
7. **Analytics**: Track response quality, latency metrics
8. **Multi-language**: Support Sinhala and Tamil prompts

---

**Status**: ✅ Backend orchestration system complete and ready for testing  
**Next**: Set up credentials → Run `start.ps1` → Test with frontend
