# Prompt Processor Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Set Up Google Cloud Project

```bash
# Install gcloud CLI if not already installed
# Visit: https://cloud.google.com/sdk/docs/install

# Login to GCP
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com
```

### 2. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create buddydoc-vertex-ai \
  --display-name="BuddyDoc Vertex AI Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:buddydoc-vertex-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create vertex-ai-key.json \
  --iam-account=buddydoc-vertex-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update:

```env
GOOGLE_CLOUD_PROJECT=your-actual-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./vertex-ai-key.json
```

### 4. Install Dependencies

```bash
cd backend-python
pip install -r requirements.txt
```

### 5. Start the Server

```bash
uvicorn app.main:app --reload --port 8000
```

### 6. Test the Service

Open a new terminal:

```bash
# Health check
curl http://localhost:8000/chat/health

# Process a message
curl -X POST "http://localhost:8000/chat/process" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache and fever for 2 days"}'
```

Or run the test script:

```bash
python test_prompt_processor.py
```

## 📝 Example Usage

### From Frontend (React Native)

```typescript
const processMessage = async (message: string) => {
  try {
    const response = await fetch('http://localhost:8000/chat/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        user_id: currentUserId
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Intent:', result.intent);
      console.log('Medical Concerns:', result.medical_concerns);
      
      // Handle based on intent
      switch (result.intent) {
        case 'log_symptom':
          // Navigate to symptom logging screen
          break;
        case 'prepare_consultation':
          // Navigate to consultation prep screen
          break;
        // ... handle other intents
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
};
```

### From Python Backend

```python
from app.services.prompt_processor import get_prompt_processor

async def handle_user_message(message: str, user_id: str):
    processor = get_prompt_processor()
    
    result = await processor.process_chat_message(
        user_message=message,
        conversation_history=get_user_history(user_id)
    )
    
    # Handle the result
    if result['intent'] == 'log_symptom':
        await save_symptom_to_journey(user_id, result)
    elif result['action_required'] == 'trigger_alert':
        await send_urgent_notification(user_id, result)
    
    return result
```

## 🎯 Common Use Cases

### 1. Symptom Logging
```python
message = "I've had a migraine for 3 days, it's really bad on my left side"
result = await processor.process_chat_message(message)
# Intent: log_symptom
# Entities: [{type: "symptom", value: "migraine"}, {type: "duration", value: "3 days"}]
```

### 2. Consultation Preparation
```python
message = "I have an appointment with Dr. Smith tomorrow about my diabetes"
result = await processor.process_chat_message(message)
# Intent: prepare_consultation
# Action: Add to consultation prep
```

### 3. Medication Tracking
```python
message = "I started taking metformin 500mg twice daily"
result = await processor.process_chat_message(message)
# Intent: record_medication
# Entities: [{type: "medication", value: "metformin", dose: "500mg", frequency: "twice daily"}]
```

## 🔧 Troubleshooting

### Issue: "GOOGLE_CLOUD_PROJECT environment variable is required"
**Solution:** Make sure your `.env` file exists and contains the correct values.

### Issue: "Permission denied" errors
**Solution:** 
```bash
# Verify service account has permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:buddydoc-vertex-ai@*"
```

### Issue: Slow response times
**Solution:** 
- Use a closer GCP region
- Reduce `max_output_tokens` in `prompt_processor.py`
- Check your internet connection

## 📊 Monitoring

View your API usage in GCP Console:
1. Go to Vertex AI → Dashboard
2. Check "Prediction requests" and "Tokens used"
3. Set up billing alerts to avoid surprises

## 🔐 Security Checklist

- [ ] Don't commit `.env` file or service account keys
- [ ] Use environment-specific service accounts (dev/prod)
- [ ] Enable audit logging in GCP
- [ ] Implement rate limiting on endpoints
- [ ] Validate user authentication before processing
- [ ] Don't log sensitive health information

## 💰 Cost Estimation

Gemini Pro pricing (approximate):
- Input: $0.00025 per 1K characters
- Output: $0.0005 per 1K characters

Example calculation:
- 1,000 messages/day
- Average 200 chars input + 300 chars output per message
- Daily cost: ~$0.40
- Monthly cost: ~$12

## 📚 Next Steps

1. **Integrate with Patient Journey Agent**: Store extracted symptoms in Neo4j
2. **Connect to Disease Prediction Agent**: Use extracted symptoms for predictions
3. **Add Conversation Memory**: Store chat history in database
4. **Implement Feedback Loop**: Collect user feedback to improve prompts
5. **Add Multi-language Support**: Extend to other languages

## 🆘 Need Help?

See full documentation: `PROMPT_PROCESSOR_DOCS.md`

For issues, check:
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [LangChain Documentation](https://python.langchain.com/)
- Project GitHub issues
