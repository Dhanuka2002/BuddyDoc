"""
Simple FastAPI backend skeleton for BuddyDoc.

Endpoints:
- POST /api/v1/patient/chat : expects Authorization: Bearer <firebase_id_token>

This service verifies Firebase ID tokens using the Firebase Admin SDK.

Before running locally, set the environment variable GOOGLE_APPLICATION_CREDENTIALS
to point to your Firebase service account JSON file.

Run with:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
import os

app = FastAPI(title="BuddyDoc Backend")

# Initialize Firebase Admin with service account if available
_firebase_initialized = False
try:
    if not firebase_admin._apps:
        cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            _firebase_initialized = True
        else:
            # Try default application credentials
            firebase_admin.initialize_app()
            _firebase_initialized = True
except Exception as e:
    # Log initialization error - verification will fail if not initialized
    print('Firebase Admin initialization failed:', e)


async def verify_firebase_token(request: Request):
    auth_header = request.headers.get('authorization')
    if not auth_header or not auth_header.lower().startswith('bearer '):
        raise HTTPException(status_code=401, detail='Missing or invalid Authorization header')
    id_token = auth_header.split(' ', 1)[1]
    if not _firebase_initialized:
        raise HTTPException(status_code=500, detail='Firebase Admin not initialized on server (check GOOGLE_APPLICATION_CREDENTIALS)')
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f'Invalid ID token: {e}')


@app.post('/api/v1/patient/chat')
async def patient_chat(payload: dict, decoded_token=Depends(verify_firebase_token)):
    """Simple authenticated chat endpoint.

    Returns a mock reply and echoes the authenticated user's uid.
    """
    message = payload.get('message', '')
    uid = decoded_token.get('uid')
    # For a real implementation, this would forward message to AI agents
    reply = f"(mock reply) Received '{message[:200]}' from user {uid}"
    return JSONResponse({'reply': reply, 'user': uid})
