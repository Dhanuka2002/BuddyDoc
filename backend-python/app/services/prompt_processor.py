"""
Prompt Processor Service

This service uses Vertex AI with Gemini Pro LLM via LangChain to extract 
semantic meaning from user chat messages.
"""

import os
import logging
from typing import Optional, Dict, Any
from langchain_google_vertexai import ChatVertexAI
from langchain_core.messages import HumanMessage, SystemMessage
from google.cloud import aiplatform

logger = logging.getLogger(__name__)


class PromptProcessor:
    """
    Service for processing user prompts and extracting semantic meaning
    using Vertex AI Gemini Pro LLM via LangChain.
    """
    
    def __init__(self):
        """Initialize the Prompt Processor with Vertex AI configuration."""
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        self.location = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
        
        if not self.project_id:
            raise ValueError("GOOGLE_CLOUD_PROJECT environment variable is required")
        
        # Initialize Vertex AI
        aiplatform.init(project=self.project_id, location=self.location)
        logger.info(f"Initialized Vertex AI with project: {self.project_id}, location: {self.location}")
        
        # Initialize LangChain Gemini Pro model
        self.llm = ChatVertexAI(
            project=self.project_id,
            model_name="gemini-2.5-pro",
            temperature=0.3,  # Lower temperature for more consistent semantic extraction
            max_output_tokens=2048,
            location=self.location
        )
        
        # Define system prompt for semantic extraction
        self.system_prompt = """You are a medical semantic analyzer for a patient consultation preparation app.
Your task is to extract structured semantic meaning from user messages related to health symptoms, medical history, and consultation needs.

Extract and return the following information in JSON format:
1. intent: The user's primary intention (e.g., "log_symptom", "ask_question", "prepare_consultation", "record_medication", "general_query")
2. entities: Key medical entities mentioned (symptoms, medications, conditions, body parts, dates, severity levels)
3. context: Additional contextual information (urgency, emotional tone, temporal references)
4. medical_concerns: List of specific health concerns or symptoms mentioned
5. action_required: What action the system should take based on this message
6. confidence: Your confidence level in this analysis (0.0-1.0)

Be precise, extract only factual information, and maintain patient privacy by not making assumptions."""

    async def process_chat_message(
        self, 
        user_message: str, 
        conversation_history: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Process a user chat message and extract semantic meaning.
        
        Args:
            user_message: The user's chat message
            conversation_history: Optional list of previous messages for context
            
        Returns:
            Dictionary containing semantic analysis results
        """
        try:
            # Build the prompt
            messages = [
                SystemMessage(content=self.system_prompt),
            ]
            
            # Add conversation history if provided
            if conversation_history:
                for msg in conversation_history[-5:]:  # Last 5 messages for context
                    messages.append(HumanMessage(content=msg))
            
            # Add current user message
            messages.append(HumanMessage(content=f"Analyze this message: {user_message}"))
            
            # Get response from Gemini Pro
            logger.info(f"Processing message: {user_message[:50]}...")
            response = await self.llm.ainvoke(messages)
            
            # Parse the response
            result = self._parse_llm_response(response.content, user_message)
            
            logger.info(f"Successfully processed message with intent: {result.get('intent')}")
            return result
            
        except Exception as e:
            logger.error(f"Error processing chat message: {str(e)}")
            return {
                "error": str(e),
                "intent": "unknown",
                "entities": [],
                "context": {},
                "medical_concerns": [],
                "action_required": "error_handling",
                "confidence": 0.0,
                "raw_message": user_message
            }
    
    def _parse_llm_response(self, llm_output: str, original_message: str) -> Dict[str, Any]:
        """
        Parse the LLM response and structure it.
        
        Args:
            llm_output: Raw output from the LLM
            original_message: The original user message
            
        Returns:
            Structured semantic analysis dictionary
        """
        import json
        
        try:
            # Try to parse as JSON first
            if "```json" in llm_output:
                json_str = llm_output.split("```json")[1].split("```")[0].strip()
                parsed = json.loads(json_str)
            elif "{" in llm_output and "}" in llm_output:
                # Extract JSON from the response
                start = llm_output.index("{")
                end = llm_output.rindex("}") + 1
                json_str = llm_output[start:end]
                parsed = json.loads(json_str)
            else:
                # Fallback: create structured response from text
                parsed = self._create_fallback_response(llm_output, original_message)
            
            # Ensure all required fields are present
            parsed.setdefault("intent", "unknown")
            parsed.setdefault("entities", [])
            parsed.setdefault("context", {})
            parsed.setdefault("medical_concerns", [])
            parsed.setdefault("action_required", "review")
            parsed.setdefault("confidence", 0.7)
            parsed["raw_message"] = original_message
            parsed["llm_response"] = llm_output
            
            return parsed
            
        except Exception as e:
            logger.error(f"Error parsing LLM response: {str(e)}")
            return self._create_fallback_response(llm_output, original_message)
    
    def _create_fallback_response(self, llm_output: str, original_message: str) -> Dict[str, Any]:
        """
        Create a fallback response when JSON parsing fails.
        
        Args:
            llm_output: Raw LLM output
            original_message: Original user message
            
        Returns:
            Basic structured response
        """
        return {
            "intent": "general_query",
            "entities": [],
            "context": {
                "parse_failed": True,
                "llm_output_preview": llm_output[:200]
            },
            "medical_concerns": [],
            "action_required": "manual_review",
            "confidence": 0.5,
            "raw_message": original_message,
            "llm_response": llm_output
        }
    
    async def extract_symptoms(self, user_message: str) -> Dict[str, Any]:
        """
        Specialized method to extract symptom information from user message.
        
        Args:
            user_message: The user's message describing symptoms
            
        Returns:
            Dictionary with structured symptom data
        """
        symptom_prompt = SystemMessage(content="""Extract symptom information from the user's message.
Return JSON with:
- symptoms: List of {name, severity (1-10), onset, duration, location, triggers}
- urgency: low/medium/high/critical
- recommended_action: what the user should do
- confidence: 0.0-1.0""")
        
        try:
            messages = [symptom_prompt, HumanMessage(content=user_message)]
            response = await self.llm.ainvoke(messages)
            return self._parse_llm_response(response.content, user_message)
        except Exception as e:
            logger.error(f"Error extracting symptoms: {str(e)}")
            return {"error": str(e), "symptoms": [], "urgency": "unknown"}


# Singleton instance
_prompt_processor_instance: Optional[PromptProcessor] = None


def get_prompt_processor() -> PromptProcessor:
    """
    Get or create the singleton PromptProcessor instance.
    
    Returns:
        PromptProcessor instance
    """
    global _prompt_processor_instance
    if _prompt_processor_instance is None:
        _prompt_processor_instance = PromptProcessor()
    return _prompt_processor_instance
