# BuddyDoc Backend - Setup Checklist

Use this checklist to track your backend setup progress.

## 📦 Prerequisites

- [ ] Python 3.11+ installed
  - Verify: `python --version`
  - Download: https://www.python.org/downloads/

- [ ] Git installed (for version control)
  - Verify: `git --version`

- [ ] Text editor ready (VS Code recommended)

## 🔧 Backend Setup

### Step 1: Virtual Environment
- [ ] Navigate to `backend-python` folder
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate venv: `.\venv\Scripts\Activate.ps1`
  - If error, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- [ ] Verify activation (see `(venv)` in prompt)

### Step 2: Dependencies
- [ ] Install packages: `pip install -r requirements.txt`
- [ ] Verify installation: `pip list | Select-String fastapi`
- [ ] Should see: fastapi, uvicorn, langchain, etc.

### Step 3: Google Cloud Platform (Vertex AI)
- [ ] Create GCP account: https://console.cloud.google.com/
- [ ] Create new project (e.g., "buddydoc-prod")
- [ ] Enable Vertex AI API:
  - Navigation Menu → Vertex AI → Enable
- [ ] Create service account:
  - IAM & Admin → Service Accounts → Create
  - Name: "buddydoc-backend"
  - Grant role: "Vertex AI User"
- [ ] Create JSON key:
  - Click service account → Keys → Add Key → JSON
  - Save file securely (e.g., `gcp-key.json`)
- [ ] Note your project ID: ___________________________

### Step 4: Neo4j Aura (Graph Database)
- [ ] Sign up: https://neo4j.com/cloud/aura/
- [ ] Create free AuraDB instance:
  - Click "Create Free Database"
  - Save auto-generated password: ___________________________
- [ ] Download connection URI:
  - Should look like: `neo4j+s://xxxxx.databases.neo4j.io`
  - URI: ___________________________
- [ ] Wait for instance to be "Running" (green)

### Step 5: Firebase
- [ ] Create Firebase project: https://console.firebase.google.com/
- [ ] Project name: buddydoc (or your choice)
- [ ] Enable Authentication:
  - Build → Authentication → Get Started
  - Enable Email/Password provider
- [ ] Generate Admin SDK key:
  - Project Settings → Service Accounts
  - Click "Generate new private key"
  - Save file securely (e.g., `firebase-key.json`)
- [ ] Note project ID: ___________________________

### Step 6: Environment Configuration
- [ ] Copy template: `Copy-Item .env.example .env`
- [ ] Open `.env` file in editor
- [ ] Fill in Google Cloud values:
  ```
  GOOGLE_CLOUD_PROJECT=your-project-id-here
  GOOGLE_CLOUD_LOCATION=us-central1
  GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\gcp-key.json
  ```
- [ ] Fill in Neo4j values:
  ```
  NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
  NEO4J_USER=neo4j
  NEO4J_PASSWORD=your-password-here
  ```
- [ ] Fill in Firebase values:
  ```
  FIREBASE_CREDENTIALS=C:\path\to\firebase-key.json
  FIREBASE_PROJECT_ID=your-firebase-project-id
  ```
- [ ] Save `.env` file
- [ ] Verify `.env` is in `.gitignore` (should be by default)

## ✅ Testing

### Test 1: Agent Unit Tests
- [ ] Run: `python -m app.test_agents`
- [ ] Should see output from Agent A and Agent B
- [ ] Both agents should respond (Agent B in stub mode)

### Test 2: Start Server
- [ ] Run: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- [ ] Should see: "Application startup complete"
- [ ] No import errors or crashes

### Test 3: Health Check
- [ ] Open browser: http://localhost:8000/health/
- [ ] Should see: `{"status": "ok", "service": "buddydoc-backend"}`

### Test 4: API Documentation
- [ ] Open browser: http://localhost:8000/docs
- [ ] Should see Swagger UI with endpoints:
  - GET `/`
  - GET `/health/`
  - POST `/orchestrator/chat`

### Test 5: Chat Endpoint (PowerShell)
```powershell
$body = @{
    user_id = "test-user-123"
    session_id = "test-session-456"
    message = "I have a fever and headache"
    context = @{
        opt_in_llm = $false
    }
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/orchestrator/chat" -Method POST -ContentType "application/json" -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

- [ ] Run the above command
- [ ] Should receive response with:
  - `reply` containing text from Agent A and Agent B
  - `sources` array with 2 agents
  - `meta` with count and timestamp
- [ ] Agent A should mention symptom severity or logging
- [ ] Agent B should provide empathetic response (stub mode)

## 🚀 Optional: Neo4j Data Population

### Populate Ontology (Optional for Testing)
- [ ] Open Neo4j Browser: https://console.neo4j.io/
- [ ] Select your database
- [ ] Run Cypher queries:

```cypher
// Create symptoms
CREATE (s1:Symptom {name: "Fever", description: "Elevated body temperature"})
CREATE (s2:Symptom {name: "Headache", description: "Pain in the head"})
CREATE (s3:Symptom {name: "Cough", description: "Forceful expulsion of air"})
CREATE (s4:Symptom {name: "Fatigue", description: "Extreme tiredness"})

// Create medications
CREATE (m1:Medication {name: "Paracetamol", type: "Pain reliever"})
CREATE (m2:Medication {name: "Ibuprofen", type: "Anti-inflammatory"})

// Create relationships
MATCH (s1:Symptom {name: "Fever"}), (s2:Symptom {name: "Headache"})
CREATE (s1)-[:RELATED_TO {frequency: "common"}]->(s2)

MATCH (s2:Symptom {name: "Headache"}), (s4:Symptom {name: "Fatigue"})
CREATE (s2)-[:RELATED_TO {frequency: "common"}]->(s4)
```

- [ ] Queries executed successfully
- [ ] Verify with: `MATCH (n) RETURN n LIMIT 25`

### Test Neo4j Client (Python)
```python
# In Python shell or new file
import asyncio
from app.clients.neo4j_client import Neo4jClient

async def test():
    client = Neo4jClient()
    results = await client.search_symptoms("fever")
    print(results)
    await client.close()

asyncio.run(test())
```

- [ ] Runs without connection errors
- [ ] Returns symptom data

## 🔐 Security Checklist

- [ ] `.env` file is NOT committed to git
- [ ] `.env` is listed in `.gitignore`
- [ ] Credential JSON files are NOT committed
- [ ] `*.json` is in `.gitignore` (except package.json)
- [ ] CORS is set to `*` (development only - change for production)
- [ ] Firebase auth middleware added (TODO for production)

## 📊 Performance Baseline

After setup, record baseline metrics:

- [ ] Health check response time: ______ ms
- [ ] Chat endpoint (Agent A only): ______ ms
- [ ] Chat endpoint (both agents, stub): ______ ms
- [ ] Neo4j query (if populated): ______ ms

## 🐛 Troubleshooting

### Issue: Import errors when starting server
- [ ] Verified virtual environment is activated
- [ ] Ran `pip install -r requirements.txt`
- [ ] Checked `pip list` for fastapi, uvicorn, pydantic

### Issue: Neo4j connection error
- [ ] Verified URI starts with `neo4j+s://` (SSL required)
- [ ] Checked password is correct (case-sensitive)
- [ ] Confirmed database status is "Running" in console

### Issue: Vertex AI authentication error
- [ ] Verified `GOOGLE_APPLICATION_CREDENTIALS` path is absolute
- [ ] Checked JSON key file exists at that path
- [ ] Confirmed service account has "Vertex AI User" role
- [ ] For now: Agent B runs in stub mode, so this won't block testing

### Issue: Port 8000 already in use
- [ ] Changed port: `uvicorn app.main:app --port 8001`
- [ ] Or found and killed process: `Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess`

## 📝 Next Steps

Once backend is running and tested:

- [ ] Update frontend to point to backend URL
- [ ] Test frontend HomeScreen health check
- [ ] Implement frontend Chat screen
- [ ] Connect chat input to `/orchestrator/chat` endpoint
- [ ] Test end-to-end: mobile app → API → agents → response
- [ ] Enable Agent B LLM mode (set `ENABLE_LLM_AGENT=true`)
- [ ] Test with opt-in enabled
- [ ] Add Firebase auth to frontend
- [ ] Add token verification middleware to backend

## 🎯 Completion Criteria

Backend is ready when:
- [x] All files created
- [ ] Virtual environment working
- [ ] Dependencies installed
- [ ] Server starts without errors
- [ ] Health check returns 200 OK
- [ ] Chat endpoint accepts requests
- [ ] Both agents respond (even in stub mode)
- [ ] Response contains aggregated reply
- [ ] Documentation reviewed

---

**Date Started**: _____________  
**Date Completed**: _____________  
**Time Spent**: _____________  
**Issues Encountered**: _____________________________________________

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete | ⬜ Blocked

---

**Quick Start**: If you just want to test without full setup:
1. ✅ Create venv: `python -m venv venv`
2. ✅ Activate: `.\venv\Scripts\Activate.ps1`
3. ✅ Install: `pip install -r requirements.txt`
4. ✅ Create empty `.env` (Agent B will run in stub mode)
5. ✅ Start: `uvicorn app.main:app --reload`
6. ✅ Test: http://localhost:8000/docs
