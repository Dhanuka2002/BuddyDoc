"""
Chat Router

API endpoints for processing user chat messages and extracting semantic meaning.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging

from ..services.prompt_processor import get_prompt_processor

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatMessageRequest(BaseModel):
    """Request model for chat message processing."""
    message: str = Field(..., description="The user's chat message", min_length=1)
    conversation_history: Optional[List[str]] = Field(
        default=None, 
        description="Optional list of previous messages for context"
    )
    user_id: Optional[str] = Field(default=None, description="Optional user identifier")


class ChatMessageResponse(BaseModel):
    """Response model for processed chat message."""
    success: bool
    intent: str
    entities: List[Dict[str, Any]]
    context: Dict[str, Any]
    medical_concerns: List[str]
    action_required: str
    confidence: float
    raw_message: str
    llm_response: Optional[str] = None


class SymptomExtractionRequest(BaseModel):
    """Request model for symptom extraction."""
    message: str = Field(..., description="User's symptom description", min_length=1)
    user_id: Optional[str] = Field(default=None, description="Optional user identifier")


@router.post(
    "/process",
    response_model=ChatMessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Process chat message",
    description="Extract semantic meaning from user chat message using Gemini Pro LLM"
)
async def process_chat_message(request: ChatMessageRequest):
    """
    Process a user chat message and extract semantic meaning.
    
    This endpoint uses Vertex AI Gemini Pro via LangChain to analyze
    the user's message and extract structured information including:
    - Intent classification
    - Entity extraction (symptoms, medications, conditions)
    - Contextual information
    - Medical concerns
    - Recommended actions
    """
    try:
        logger.info(f"Processing chat message from user: {request.user_id or 'anonymous'}")
        
        # Get the prompt processor service
        processor = get_prompt_processor()
        
        # Process the message
        result = await processor.process_chat_message(
            user_message=request.message,
            conversation_history=request.conversation_history
        )
        
        # Check for errors in processing
        if "error" in result and result.get("intent") == "unknown":
            logger.error(f"Error processing message: {result['error']}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing message: {result['error']}"
            )
        
        # Return structured response
        return ChatMessageResponse(
            success=True,
            intent=result.get("intent", "unknown"),
            entities=result.get("entities", []),
            context=result.get("context", {}),
            medical_concerns=result.get("medical_concerns", []),
            action_required=result.get("action_required", "review"),
            confidence=result.get("confidence", 0.0),
            raw_message=result.get("raw_message", request.message),
            llm_response=result.get("llm_response")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in process_chat_message: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post(
    "/extract-symptoms",
    status_code=status.HTTP_200_OK,
    summary="Extract symptoms from message",
    description="Specialized endpoint for extracting structured symptom information"
)
async def extract_symptoms(request: SymptomExtractionRequest):
    """
    Extract structured symptom information from user message.
    
    This endpoint focuses specifically on identifying and structuring
    symptom-related information including:
    - Symptom names
    - Severity levels
    - Onset and duration
    - Location and triggers
    - Urgency assessment
    """
    try:
        logger.info(f"Extracting symptoms for user: {request.user_id or 'anonymous'}")
        
        # Get the prompt processor service
        processor = get_prompt_processor()
        
        # Extract symptoms
        result = await processor.extract_symptoms(user_message=request.message)
        
        # Check for errors
        if "error" in result:
            logger.error(f"Error extracting symptoms: {result['error']}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error extracting symptoms: {result['error']}"
            )
        
        return {
            "success": True,
            "symptoms": result.get("symptoms", []),
            "urgency": result.get("urgency", "unknown"),
            "recommended_action": result.get("recommended_action", "consult_doctor"),
            "confidence": result.get("confidence", 0.0),
            "raw_message": request.message
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in extract_symptoms: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check for chat service"
)
async def health_check():
    """Check if the chat processing service is operational."""
    try:
        processor = get_prompt_processor()
        return {
            "status": "healthy",
            "service": "prompt_processor",
            "llm_model": "gemini-1.5-pro",
            "project": processor.project_id,
            "location": processor.location
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unavailable: {str(e)}"
        )
