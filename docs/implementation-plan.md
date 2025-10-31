# Implementation Plan — PatientPrep SL (BuddyDoc)

This document maps the epics into a practical implementation plan, split into 2-week sprints for a 3-month MVP (approx. 6 sprints). It also lists first actionable tasks so we can start implementing immediately.

## Goals
- Deliver an MVP that covers core UX: local encrypted storage, symptom/medication/question management, appointment basics, and a safe AI-guidance MVP (agentic suggestions) while keeping all patient health data local-first.

## Scope update — focused MVP

Based on the attached architecture diagram and recent direction, the MVP scope will focus on:

- Two agents only (Agent 1 + Agent 2)
	- Agent 1: Symptom analysis and follow-up question suggestions (LLM-backed, env-driven).
	- Agent 2: Disease prediction agent — take the latest symptoms and predict likely diagnoses (heuristic/ML-backed; can start as deterministic rules then iterate to ML).
- Patient Journey Tracking: record the patient's journey (visits, symptoms, diagnoses, treatments, timestamps). Provide CRUD APIs and a frontend timeline that visualizes where the patient went and what they experienced.
- Attractive mobile-first frontend: a polished landing/onboarding, a Journey timeline UI, a Symptom entry + chat interface to consult the agents, and a Summary/Export screen.

This narrows the initial effort and provides clear deliverables for the first meaningful demos.

## High-level timeline (6 x 2-week sprints)
- Sprint 0 (setup, planning) — current (2 weeks): finalize requirements, developer environment, CI, auth skeleton.
- Sprint 1 (core infra + auth) — encrypted local DB, frontend auth flows, backend token verification, basic symptom CRUD.
- Sprint 2 (symptoms + meds) — full symptom features, medication CRUD, basic UI polish.
- Sprint 3 (question builder + summary) — question composer, summary generator, export/print.
- Sprint 4 (appointments + post-visit) — appointments, provider management, post-visit notes and action items.
- Sprint 5 (AI guidance + polish) — Agentic AI integration (safe prompts, rate limiting), accessibility, testing and release prep.

## Acceptance criteria (per epic - condensed)
- Epic 1 (Auth & infra): users can register/login via Firebase, frontend stores token securely, backend verifies tokens for protected endpoints.
- Epic 2/3/4 (Symptom/Medication/Question): Full CRUD, local encrypted storage, UI with search/filter, unit tests for core data operations.
- Epic 5 (Summary): One-click summary generation with preview and export (PDF or text) without leaking PII externally.
- Epic 7 (Agentic AI): Orchestrator calls agents; agents return standardized schema; agent1 supports real LLM routes behind env flag; tests mock external HTTP calls.

## Tech choices & rationale
- Frontend: Expo React Native. Use SecureStore for storing tokens and keys, SQLite (expo-sqlite) wrapped with encryption layer (sqlcipher or an encrypted wrapper library). Keep everything on-device by default.
- Backend: FastAPI microservices (orchestrator + agents). Use httpx for outgoing calls, pydantic models for schemas, dotenv for env.
- LLM: OpenAI SDK in agent1 (env-driven), with respx-based tests and a clear fail-safe mock behavior.
- Tests: pytest + pytest-asyncio for Python; respx for HTTP mocking. Add Detox / E2E later for mobile flows.
- CI: GitHub Actions — run lint, unit tests, integration tests, and publish artifacts.

## Risks & mitigations
- Risk: LLM costs & privacy. Mitigation: default to mock mode unless OPENAI_API_KEY present; rate-limit LLM usage; explicit prompts avoid PHI transmission.
- Risk: Data security on-device. Mitigation: AES-256 local DB encryption, keystore-backed key, clear UI explaining local-only storage.

## First actionable tasks (today / next 48 hours)
1. Lock developer environment and document it. Create `scripts/setup-dev.ps1` to create venvs and install requirements for orchestration, agent1, and agent2, plus `frontend` npm install. (Task in todo list)
2. Implement backend Firebase token verification helper (`backend/common/auth.py`) and a FastAPI dependency `get_current_user` that returns uid or raises 401.
3. Implement frontend auth UI skeleton (`frontend/AuthProvider.js`, `frontend/screens/Login.js`, `frontend/screens/Register.js`) that uses firebase client SDK and stores ID token in SecureStore.
4. Hook the orchestrate endpoint to require the token dependency; expose an unprotected `/health` endpoint for readiness.
5. Add an `implementation-plan.md` (this file) and link to `docs/run-local.md` and `.env.example`.

## Branching & review process
- Create feature branches for each task: `feature/auth-frontend`, `feature/auth-backend`, `feature/symptoms-crud`, etc.
- Use PRs with at least one reviewer, include tests for new behavior, and rely on CI to run tests.

## Developer commands (quick)
PowerShell examples (use from project root):

```powershell
# create orchestration venv & install
cd backend/orchestration
python -m venv .venv
.\.venv\Scripts\Activate
python -m pip install -r requirements.txt

# run orchestration
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# run agents (in their folders)
cd ../agent1
.\.venv\Scripts\Activate
uvicorn main:app --reload --host 127.0.0.1 --port 8101

cd ../agent2
.\.venv\Scripts\Activate
uvicorn main:app --reload --host 127.0.0.1 --port 8102

# frontend
cd frontend
npm install --legacy-peer-deps
npx expo start --web
```

## Next immediate implementation step (I will execute)
I will implement task 2 from the 'First actionable tasks' list: create `backend/common/auth.py` that exposes a FastAPI dependency `get_current_user` which:

- Reads the Authorization header `Bearer <id_token>`
- Calls Firebase Admin SDK to verify token and returns uid (or raises HTTPException 401)
- Includes a simple unit test `backend/tests/test_auth.py` that mocks firebase_admin.auth.verify_id_token

I'll add the file and the test now and run the Python tests for orchestration service. If you prefer I start with the frontend AuthProvider instead, tell me and I'll pivot.
