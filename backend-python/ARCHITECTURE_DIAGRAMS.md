# Prompt Processor Service - Architecture Diagram

## System Architecture (for Eraser.io)

```eraser
// Prompt Processor Service Architecture

// Frontend Layer
box "React Native App" as Frontend #lightblue {
  box "Chat Screen" as ChatUI
  box "Symptom Logger" as SymptomUI
}

// Client Layer
box "TypeScript Client" as Client #lightgreen {
  box "promptProcessorClient.ts" as APIClient
}

// API Layer
box "FastAPI Backend" as API #yellow {
  box "/chat/process" as ProcessEndpoint
  box "/chat/extract-symptoms" as ExtractEndpoint
  box "/chat/health" as HealthEndpoint
}

// Service Layer
box "Services" as Services #orange {
  box "PromptProcessor" as Processor {
    box "process_chat_message()" as ProcessMethod
    box "extract_symptoms()" as ExtractMethod
  }
}

// AI Layer
box "Google Cloud Platform" as GCP #purple {
  box "Vertex AI" as VertexAI {
    box "Gemini 1.5 Pro" as Gemini
  }
  box "LangChain" as LangChain #lavender
}

// Data Flow
Frontend -> Client : "User message"
Client -> API : "HTTP POST"
API -> Services : "Process request"
Services -> LangChain : "Build prompt"
LangChain -> VertexAI : "Invoke model"
VertexAI -> Gemini : "Generate response"
Gemini -> VertexAI : "Semantic analysis"
VertexAI -> LangChain : "LLM output"
LangChain -> Services : "Structured data"
Services -> API : "JSON response"
API -> Client : "HTTP 200"
Client -> Frontend : "Display results"

// Integration Points
box "Integration" as Integration #pink {
  box "Neo4j (Journey)" as Neo4j
  box "Disease Prediction" as Prediction
}

Services -> Neo4j : "Save symptoms"
Services -> Prediction : "Symptom data"
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User types: "I have a headache and fever"          │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend (React Native)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  promptProcessorClient.processChatMessage()          │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP POST
                            │ { message, user_id }
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /chat/process                                   │  │
│  │  - Validate request                                   │  │
│  │  - Call PromptProcessor service                       │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         PromptProcessor Service                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Build system prompt                               │  │
│  │  2. Add conversation history (optional)               │  │
│  │  3. Format user message                               │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              LangChain Layer                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ChatVertexAI                                         │  │
│  │  - model: gemini-1.5-pro                             │  │
│  │  - temperature: 0.3                                   │  │
│  │  - max_tokens: 2048                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         Google Vertex AI                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Gemini 1.5 Pro LLM                                   │  │
│  │  - Analyze semantic meaning                           │  │
│  │  - Extract entities                                   │  │
│  │  - Classify intent                                    │  │
│  │  - Assess urgency                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ LLM Response (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         PromptProcessor Service                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Parse LLM response:                                  │  │
│  │  - Extract JSON                                       │  │
│  │  - Validate structure                                 │  │
│  │  - Add metadata                                       │  │
│  │  - Handle errors (fallback)                           │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ Structured Response
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Return JSON response:                                │  │
│  │  {                                                    │  │
│  │    "intent": "log_symptom",                          │  │
│  │    "entities": [...],                                │  │
│  │    "medical_concerns": ["headache", "fever"],        │  │
│  │    "confidence": 0.92                                │  │
│  │  }                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP 200
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend (React Native)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Handle response based on intent:                     │  │
│  │  - log_symptom → Navigate to symptom logger          │  │
│  │  - prepare_consultation → Open prep tools            │  │
│  │  - trigger_alert → Show urgent notification          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │ Types message
       ▼
┌──────────────────────────────────────────────────────┐
│          FRONTEND LAYER (React Native)               │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Chat UI Component                         │    │
│  │  - TextInput                               │    │
│  │  - Send Button                             │    │
│  │  - Result Display                          │    │
│  └─────────────────┬──────────────────────────┘    │
│                    │                                │
│  ┌─────────────────▼──────────────────────────┐    │
│  │  promptProcessorClient.ts                  │    │
│  │  - processChatMessage()                    │    │
│  │  - extractSymptoms()                       │    │
│  │  - healthCheck()                           │    │
│  └─────────────────┬──────────────────────────┘    │
└────────────────────┼──────────────────────────────┘
                     │ HTTP Request
                     │
┌────────────────────▼──────────────────────────────┐
│          API LAYER (FastAPI)                      │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │  app/routers/chat.py                       │  │
│  │                                            │  │
│  │  ┌──────────────────────────────────────┐ │  │
│  │  │ POST /chat/process                   │ │  │
│  │  │ - Validate ChatMessageRequest        │ │  │
│  │  │ - Call service                       │ │  │
│  │  │ - Return ChatMessageResponse         │ │  │
│  │  └──────────────────────────────────────┘ │  │
│  │                                            │  │
│  │  ┌──────────────────────────────────────┐ │  │
│  │  │ POST /chat/extract-symptoms          │ │  │
│  │  │ - Validate request                   │ │  │
│  │  │ - Extract symptom data               │ │  │
│  │  └──────────────────────────────────────┘ │  │
│  │                                            │  │
│  │  ┌──────────────────────────────────────┐ │  │
│  │  │ GET /chat/health                     │ │  │
│  │  │ - Check service status               │ │  │
│  │  └──────────────────────────────────────┘ │  │
│  └─────────────────┬──────────────────────────┘  │
└────────────────────┼──────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────┐
│          SERVICE LAYER                            │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │  app/services/prompt_processor.py          │  │
│  │                                            │  │
│  │  ┌──────────────────────────────────────┐ │  │
│  │  │ class PromptProcessor:               │ │  │
│  │  │                                      │ │  │
│  │  │  __init__():                         │ │  │
│  │  │    - Initialize Vertex AI            │ │  │
│  │  │    - Create ChatVertexAI instance    │ │  │
│  │  │    - Set system prompt               │ │  │
│  │  │                                      │ │  │
│  │  │  async process_chat_message():       │ │  │
│  │  │    - Build prompt                    │ │  │
│  │  │    - Call LLM                        │ │  │
│  │  │    - Parse response                  │ │  │
│  │  │                                      │ │  │
│  │  │  async extract_symptoms():           │ │  │
│  │  │    - Specialized symptom extraction  │ │  │
│  │  │                                      │ │  │
│  │  │  _parse_llm_response():              │ │  │
│  │  │    - Extract JSON                    │ │  │
│  │  │    - Fallback handling               │ │  │
│  │  └──────────────────────────────────────┘ │  │
│  └─────────────────┬──────────────────────────┘  │
└────────────────────┼──────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────┐
│          AI LAYER                                 │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │  LangChain                                 │  │
│  │  ┌──────────────────────────────────────┐ │  │
│  │  │ ChatVertexAI                         │ │  │
│  │  │ - model: gemini-1.5-pro             │ │  │
│  │  │ - temperature: 0.3                   │ │  │
│  │  │ - max_tokens: 2048                   │ │  │
│  │  └──────────────────────────────────────┘ │  │
│  └─────────────────┬──────────────────────────┘  │
│                    │                              │
│  ┌─────────────────▼──────────────────────────┐  │
│  │  Google Vertex AI                          │  │
│  │  ┌──────────────────────────────────────┐ │  │
│  │  │ Gemini 1.5 Pro                       │ │  │
│  │  │ - Natural language understanding     │ │  │
│  │  │ - Entity extraction                  │ │  │
│  │  │ - Intent classification              │ │  │
│  │  │ - Context analysis                   │ │  │
│  │  └──────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

## Integration Flow

```
Prompt Processor Service
         │
         ├─── Stores to ──→ Neo4j Database
         │                  (Patient Journey Graph)
         │                   - Symptoms as nodes
         │                   - Relationships
         │                   - Timeline data
         │
         ├─── Feeds to ───→ Disease Prediction Agent
         │                  (Uses extracted symptoms)
         │                   - Symptom vectors
         │                   - Context data
         │                   - Urgency flags
         │
         └─── Triggers ───→ Orchestration Agent
                            (Coordinates workflow)
                             - Route by intent
                             - Trigger alerts
                             - Update UI
```

## Sequence Diagram

```
User        Frontend    API         Service      LangChain    Vertex AI
 │             │         │             │             │            │
 │─type────────│         │             │             │            │
 │ message     │         │             │             │            │
 │             │         │             │             │            │
 │             │─POST────│             │             │            │
 │             │ /chat/  │             │             │            │
 │             │ process │             │             │            │
 │             │         │             │             │            │
 │             │         │─call────────│             │            │
 │             │         │ service     │             │            │
 │             │         │             │             │            │
 │             │         │             │─build───────│            │
 │             │         │             │ prompt      │            │
 │             │         │             │             │            │
 │             │         │             │             │─invoke─────│
 │             │         │             │             │ model      │
 │             │         │             │             │            │
 │             │         │             │             │            │──┐
 │             │         │             │             │            │  │ Generate
 │             │         │             │             │            │  │ semantic
 │             │         │             │             │            │  │ analysis
 │             │         │             │             │            │◄─┘
 │             │         │             │             │            │
 │             │         │             │             │◄───────────│
 │             │         │             │             │ response   │
 │             │         │             │◄────────────│            │
 │             │         │             │ structured  │            │
 │             │         │◄────────────│             │            │
 │             │         │ JSON        │             │            │
 │             │◄────────│             │             │            │
 │             │ 200 OK  │             │             │            │
 │◄────────────│         │             │             │            │
 │ display     │         │             │             │            │
 │             │         │             │             │            │
```

## File Structure

```
backend-python/
├── app/
│   ├── services/
│   │   ├── __init__.py
│   │   └── prompt_processor.py ← Core service
│   │
│   ├── routers/
│   │   ├── chat.py ← API endpoints
│   │   └── health.py
│   │
│   └── main.py ← FastAPI app (includes chat router)
│
├── test_prompt_processor.py ← Test suite
├── PROMPT_PROCESSOR_DOCS.md ← Full documentation
├── PROMPT_PROCESSOR_QUICKSTART.md ← Quick start
├── PROMPT_PROCESSOR_COMPLETE.md ← This summary
├── requirements.txt ← Dependencies
└── .env ← Configuration

frontend/
└── src/
    └── services/
        └── promptProcessorClient.ts ← TypeScript client
```

---

Use these diagrams with Eraser.io to visualize the complete architecture!
