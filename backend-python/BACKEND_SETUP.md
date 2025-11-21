# Backend Setup & Run Guide

## Prerequisites
- Python 3.11+ installed
- Google Cloud Platform account (for Vertex AI)
- Neo4j Aura account (free tier available)
- Firebase project (for authentication)

## Step 1: Create Virtual Environment

```powershell
# Navigate to backend-python directory
cd backend-python

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# If execution policy error, run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Step 2: Install Dependencies

```powershell
# Install all requirements
pip install -r requirements.txt
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` and fill in your actual values:
   - **Google Cloud**: 
     - Create a service account with Vertex AI permissions
     - Download JSON key file
     - Set `GOOGLE_APPLICATION_CREDENTIALS` path
   - **Neo4j Aura**:
     - Create a free instance at https://neo4j.com/cloud/aura/
     - Copy connection URI, username, password
   - **Firebase**:
     - Download Firebase Admin SDK service account key
     - Set `FIREBASE_CREDENTIALS` path

## Step 4: Run the Server

```powershell
# Make sure virtual environment is activated
# You should see (venv) in your prompt

# Run with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: `http://localhost:8000`

## Step 5: Test the API

Open your browser or use curl/Postman:

- **Root endpoint**: http://localhost:8000/
- **Health check**: http://localhost:8000/health/
- **API docs**: http://localhost:8000/docs (interactive Swagger UI)
- **Orchestrator chat**: POST http://localhost:8000/orchestrator/chat

### Example Chat Request (using curl in PowerShell):

```powershell
$body = @{
    user_id = "test-user"
    session_id = "test-session"
    message = "I have a fever and headache"
    context = @{
        opt_in_llm = $false
    }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/orchestrator/chat" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

## Troubleshooting

### Import errors
- Make sure virtual environment is activated
- Run `pip list` to verify packages are installed

### Neo4j connection error
- Verify NEO4J_URI starts with `neo4j+s://` (SSL required for Aura)
- Check firewall isn't blocking Neo4j ports
- Test connection at https://console.neo4j.io/

### Vertex AI authentication error
- Ensure GOOGLE_APPLICATION_CREDENTIALS points to valid JSON key
- Run `gcloud auth application-default login` if using local development
- Verify service account has "Vertex AI User" role

### Port already in use
- Change port: `uvicorn app.main:app --port 8001`
- Or find and kill process using port 8000

## Development Tips

- **Hot reload**: The `--reload` flag automatically restarts on code changes
- **API docs**: Visit `/docs` for interactive API testing
- **Logs**: All print/logging statements appear in terminal
- **Debugging**: Add `import pdb; pdb.set_trace()` for breakpoints

## Next Steps

1. Populate Neo4j with medical ontology data (symptoms, medications)
2. Configure Firebase authentication in frontend
3. Enable LLM agent by setting `ENABLE_LLM_AGENT=true` in `.env`
4. Test end-to-end with frontend mobile app
