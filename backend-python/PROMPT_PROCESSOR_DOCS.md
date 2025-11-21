# Prompt Processor Service Documentation

## Overview

The Prompt Processor service uses **Google Vertex AI with Gemini Pro LLM** via **LangChain** to extract semantic meaning from user chat messages. This enables intelligent interpretation of patient conversations for healthcare-related queries.

## Architecture

```
User Chat Message
    ↓
FastAPI Chat Router (/chat/process)
    ↓
PromptProcessor Service
    ↓
LangChain → Vertex AI Gemini Pro
    ↓
Semantic Analysis Response
```

## Features

### 1. **Chat Message Processing** (`/chat/process`)
Extracts structured semantic meaning from user messages:
- **Intent Classification**: Determines user's primary intention
  - `log_symptom`: User wants to record a symptom
  - `ask_question`: User has a query
  - `prepare_consultation`: User is preparing for a doctor visit
  - `record_medication`: User wants to log medication
  - `general_query`: General health-related question
  
- **Entity Extraction**: Identifies key medical entities
  - Symptoms (e.g., "headache", "fever")
  - Medications (e.g., "aspirin", "ibuprofen")
  - Medical conditions (e.g., "diabetes", "hypertension")
  - Body parts (e.g., "chest", "head")
  - Temporal references (e.g., "yesterday", "for 3 days")
  - Severity levels (e.g., "mild", "severe")

- **Context Analysis**: Extracts contextual information
  - Urgency level
  - Emotional tone
  - Temporal references
  - Related concerns

- **Medical Concerns**: Lists specific health concerns mentioned

- **Action Required**: Suggests what the system should do
  - `log_to_journey`: Save to patient journey
  - `trigger_alert`: High-priority concern
  - `prepare_questions`: Add to consultation prep
  - `review`: Manual review needed

- **Confidence Score**: AI confidence level (0.0-1.0)

### 2. **Symptom Extraction** (`/chat/extract-symptoms`)
Specialized endpoint for detailed symptom analysis:
- Symptom name
- Severity (1-10 scale)
- Onset time
- Duration
- Location on body
- Triggers or aggravating factors
- Urgency assessment (low/medium/high/critical)
- Recommended action

## API Endpoints

### POST `/chat/process`
Process a user chat message and extract semantic meaning.

**Request Body:**
```json
{
  "message": "I've had a severe headache for 2 days with sensitivity to light",
  "conversation_history": [
    "Hi, I need help with my symptoms",
    "I haven't been feeling well"
  ],
  "user_id": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "intent": "log_symptom",
  "entities": [
    {
      "type": "symptom",
      "value": "headache",
      "severity": "severe"
    },
    {
      "type": "duration",
      "value": "2 days"
    },
    {
      "type": "symptom",
      "value": "photophobia"
    }
  ],
  "context": {
    "urgency": "medium",
    "temporal": "ongoing",
    "duration": "2 days"
  },
  "medical_concerns": [
    "severe headache",
    "photophobia",
    "prolonged duration"
  ],
  "action_required": "log_to_journey",
  "confidence": 0.92,
  "raw_message": "I've had a severe headache for 2 days with sensitivity to light"
}
```

### POST `/chat/extract-symptoms`
Extract structured symptom information.

**Request Body:**
```json
{
  "message": "Sharp chest pain on the left side, started this morning, gets worse when I breathe",
  "user_id": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "symptoms": [
    {
      "name": "chest pain",
      "severity": 7,
      "onset": "this morning",
      "duration": "ongoing",
      "location": "left chest",
      "triggers": "breathing",
      "characteristics": "sharp"
    }
  ],
  "urgency": "high",
  "recommended_action": "seek_immediate_medical_attention",
  "confidence": 0.95,
  "raw_message": "Sharp chest pain on the left side..."
}
```

### GET `/chat/health`
Health check for the chat processing service.

**Response:**
```json
{
  "status": "healthy",
  "service": "prompt_processor",
  "llm_model": "gemini-1.5-pro",
  "project": "your-gcp-project-id",
  "location": "us-central1"
}
```

## Setup Instructions

### 1. Prerequisites
- Google Cloud Platform account
- Vertex AI API enabled
- Service account with Vertex AI permissions
- Environment variables configured

### 2. Environment Variables
Ensure these are set in your `.env` file:

```env
# Required for Prompt Processor
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### 3. GCP Service Account Setup

1. **Create a service account:**
   ```bash
   gcloud iam service-accounts create buddydoc-vertex-ai \
     --display-name="BuddyDoc Vertex AI Service Account"
   ```

2. **Grant necessary permissions:**
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:buddydoc-vertex-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. **Create and download key:**
   ```bash
   gcloud iam service-accounts keys create vertex-ai-key.json \
     --iam-account=buddydoc-vertex-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

4. **Set the credentials path:**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/vertex-ai-key.json"
   ```

### 4. Enable Required APIs
```bash
gcloud services enable aiplatform.googleapis.com
```

## Usage Examples

### Python Client Example
```python
import httpx
import asyncio

async def process_chat():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/chat/process",
            json={
                "message": "I have a fever and cough for 3 days",
                "user_id": "patient123"
            }
        )
        result = response.json()
        print(f"Intent: {result['intent']}")
        print(f"Medical Concerns: {result['medical_concerns']}")
        print(f"Confidence: {result['confidence']}")

asyncio.run(process_chat())
```

### JavaScript/TypeScript Example
```typescript
const response = await fetch('http://localhost:8000/chat/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'I have been experiencing dizziness and nausea',
    user_id: 'patient123'
  })
});

const result = await response.json();
console.log('Intent:', result.intent);
console.log('Medical Concerns:', result.medical_concerns);
```

### cURL Example
```bash
curl -X POST "http://localhost:8000/chat/process" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need to prepare for my doctor appointment tomorrow",
    "user_id": "patient123"
  }'
```

## Testing

### Manual Testing
1. Start the server:
   ```bash
   cd backend-python
   uvicorn app.main:app --reload
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:8000/chat/health
   ```

3. Test message processing:
   ```bash
   curl -X POST "http://localhost:8000/chat/process" \
     -H "Content-Type: application/json" \
     -d '{"message": "I have a headache"}'
   ```

### Automated Testing
Create a test file `test_prompt_processor.py`:

```python
import pytest
from app.services.prompt_processor import get_prompt_processor

@pytest.mark.asyncio
async def test_process_chat_message():
    processor = get_prompt_processor()
    result = await processor.process_chat_message(
        "I have a fever and headache"
    )
    
    assert result["intent"] is not None
    assert len(result["medical_concerns"]) > 0
    assert result["confidence"] > 0.0

@pytest.mark.asyncio
async def test_extract_symptoms():
    processor = get_prompt_processor()
    result = await processor.extract_symptoms(
        "Severe chest pain for 2 hours"
    )
    
    assert "symptoms" in result
    assert result["urgency"] in ["low", "medium", "high", "critical"]
```

Run tests:
```bash
pytest test_prompt_processor.py -v
```

## Configuration

### LLM Parameters
Adjust in `app/services/prompt_processor.py`:

```python
self.llm = ChatVertexAI(
    model_name="gemini-1.5-pro",  # Model version
    temperature=0.3,               # Lower = more consistent, Higher = more creative
    max_output_tokens=2048,        # Maximum response length
    project=self.project_id,
    location=self.location
)
```

### System Prompt Customization
Modify the `system_prompt` in `PromptProcessor.__init__()` to adjust the LLM's behavior.

## Security & Privacy

### Data Handling
- ✅ Messages are processed in real-time, not stored by default
- ✅ No PHI (Personal Health Information) is logged
- ✅ User consent should be obtained before processing
- ✅ Comply with PDPA and healthcare regulations

### Best Practices
1. **Always encrypt data in transit** (use HTTPS)
2. **Don't log sensitive information** (symptoms, personal data)
3. **Implement rate limiting** to prevent abuse
4. **Validate user authentication** before processing
5. **Audit all API calls** for compliance

## Performance

### Expected Latency
- Average response time: 1-3 seconds
- Depends on message complexity and API latency

### Optimization Tips
1. **Use conversation history wisely**: Limit to last 5 messages
2. **Batch requests**: Process multiple messages together when possible
3. **Cache common intents**: Store frequently asked questions
4. **Monitor Vertex AI quotas**: Set up alerts for rate limits

## Troubleshooting

### Common Issues

**1. "GOOGLE_CLOUD_PROJECT environment variable is required"**
- Solution: Set `GOOGLE_CLOUD_PROJECT` in `.env` file

**2. "Permission denied" errors**
- Solution: Verify service account has `aiplatform.user` role
- Check `GOOGLE_APPLICATION_CREDENTIALS` points to valid JSON key

**3. "Model not found" errors**
- Solution: Ensure Vertex AI API is enabled in your GCP project
- Verify region supports Gemini Pro (`us-central1` recommended)

**4. Slow response times**
- Solution: Check network latency to GCP
- Consider using a closer region
- Reduce `max_output_tokens`

**5. JSON parsing errors**
- Solution: The service includes fallback parsing
- Check LLM output format in logs
- Adjust system prompt if needed

## Monitoring

### Key Metrics to Track
- Request count and rate
- Average response time
- Error rate
- Confidence score distribution
- Intent classification distribution
- Token usage (for cost monitoring)

### Logging
The service logs to standard output. Key log messages:
```
INFO: Initialized Vertex AI with project: xxx, location: xxx
INFO: Processing message: [first 50 chars]...
INFO: Successfully processed message with intent: log_symptom
ERROR: Error processing chat message: [error details]
```

## Cost Considerations

### Vertex AI Pricing
- Gemini Pro charges per 1,000 characters (input + output)
- Typical message: 100-500 characters
- Estimated cost: $0.001-0.005 per request
- Monitor usage in GCP Console

### Cost Optimization
1. Cache common queries
2. Use lower-cost models for simple tasks
3. Implement request throttling
4. Set monthly budget alerts in GCP

## Future Enhancements

- [ ] Multi-language support
- [ ] Batch processing endpoint
- [ ] Streaming responses for long processing
- [ ] Fine-tuned model for medical terminology
- [ ] Integration with Neo4j for context retrieval
- [ ] Feedback loop for model improvement
- [ ] Caching layer for common queries

## Support & Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [LangChain Documentation](https://python.langchain.com/)
- [Gemini Pro Model Card](https://ai.google.dev/models/gemini)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## License

This service is part of the BuddyDoc project. See main project LICENSE for details.
