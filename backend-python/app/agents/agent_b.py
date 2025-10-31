"""
Agent B: LLM-backed agent for contextual advice.
Uses LangChain + Vertex AI for natural language generation.
"""
import asyncio
import os
from typing import Optional

# TODO: Uncomment when running with dependencies installed and GCP credentials
# from langchain_google_vertexai import ChatVertexAI
# from langchain.prompts import ChatPromptTemplate
# from langchain.schema import HumanMessage


async def respond(message: str, context: dict) -> dict:
    """
    LLM-backed response using LangChain + Vertex AI.
    For now, returns a stub. Once GCP credentials are configured, 
    uncomment the LangChain code below.
    """
    # Simulate LLM processing time
    await asyncio.sleep(0.8)

    # STUB RESPONSE - Replace with actual LLM call when credentials are set
    reply = (
        "I'm here to help you prepare for your medical consultation. "
        "Could you tell me more about your symptoms or concerns?"
    )

    """
    # PRODUCTION CODE (uncomment when GCP + Vertex AI are configured):
    
    # Check for opt-in PHI handling in context
    use_llm = context.get("opt_in_llm", False)
    if not use_llm:
        return {
            "agent": "B",
            "text": "LLM assistance is available if you opt in. For now, Agent A can help with basic logging.",
            "confidence": 0.5,
            "metadata": {"type": "opt-in-required"}
        }

    # Initialize Vertex AI LLM
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    location = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
    
    llm = ChatVertexAI(
        model_name="gemini-pro",
        project=project_id,
        location=location,
        temperature=0.7
    )

    # Create prompt template
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a healthcare assistant helping patients prepare for consultations. "
                   "Be empathetic, clear, and never provide diagnoses."),
        ("human", "{input}")
    ])

    # Run chain
    chain = prompt | llm
    response = await chain.ainvoke({"input": message})
    reply = response.content
    """

    return {
        "agent": "B",
        "text": reply,
        "confidence": 0.85,
        "metadata": {
            "type": "llm",
            "model": "stub"  # Change to "gemini-pro" when live
        }
    }
