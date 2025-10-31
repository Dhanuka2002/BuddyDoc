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
    For now, returns a contextual stub. Once GCP credentials are configured, 
    uncomment the LangChain code below.
    """
    # Simulate LLM processing time
    await asyncio.sleep(0.8)

    # CONTEXTUAL STUB RESPONSE - Provides helpful medical guidance
    msg_lower = message.lower()
    
    # Emergency/severe symptoms
    if any(word in msg_lower for word in ["emergency", "urgent", "severe pain", "can't breathe", "chest pain", "blood"]):
        reply = (
            "🚨 URGENT: If you're experiencing severe symptoms, please:\n"
            "• Call emergency services (1990 in Sri Lanka)\n"
            "• Go to the nearest hospital emergency department\n"
            "• Don't delay seeking immediate medical attention\n\n"
            "BuddyDoc is for consultation preparation, not emergency care."
        )
    # Greetings
    elif any(word in msg_lower for word in ["hello", "hi", "hey", "start", "help"]) and len(msg_lower.split()) < 5:
        reply = (
            "👋 Welcome to BuddyDoc!\n\n"
            "I'm your medical consultation preparation assistant. I can help you:\n"
            "• Understand and manage your symptoms\n"
            "• Track medications safely\n"
            "• Organize medical information\n"
            "• Prepare questions for your doctor\n\n"
            "💬 Tell me: What health concerns do you have today?"
        )
    # General health inquiry with complex symptoms
    elif len(msg_lower.split()) > 8 and any(word in msg_lower for word in ["feeling", "sick", "unwell", "symptoms"]):
        reply = (
            "I understand you're not feeling well. Let me help you organize this information for your doctor:\n\n"
            "📝 Based on what you've shared, please document:\n"
            "1. **Timeline**: When did symptoms begin?\n"
            "2. **Severity**: Rate from 1-10\n"
            "3. **Triggers**: What might have caused this? (food, activity, environment)\n"
            "4. **Current state**: Are symptoms improving, worsening, or stable?\n\n"
            "💡 **Immediate steps**:\n"
            "• Log symptoms in the Symptom Logger with dates\n"
            "• Note any medications you've taken\n"
            "• Monitor for changes\n"
            "• Use Consultation Prep to generate a summary for your doctor\n\n"
            "If symptoms worsen or you're concerned, please consult a healthcare provider promptly."
        )
    # Food-related illness
    elif any(word in msg_lower for word in ["ate", "food", "eating", "ice cream", "drink"]) and \
         any(word in msg_lower for word in ["sick", "pain", "stomach", "nausea", "vomit"]):
        reply = (
            "🍽️ **Food-related symptoms**: This could be:\n"
            "• Food sensitivity/intolerance\n"
            "• Stomach upset from cold/rich foods\n"
            "• Digestive discomfort\n\n"
            "**Immediate care**:\n"
            "✓ Rest your stomach - stick to bland foods (rice, toast, bananas)\n"
            "✓ Stay hydrated with warm water or herbal tea\n"
            "✓ Avoid dairy, spicy, or fatty foods temporarily\n"
            "✓ Take small, frequent sips if nauseous\n\n"
            "**When to see a doctor**:\n"
            "⚠️ Severe abdominal pain\n"
            "⚠️ Persistent vomiting (>24 hours)\n"
            "⚠️ Signs of dehydration\n"
            "⚠️ Fever with stomach symptoms\n\n"
            "Log when symptoms started and what you ate in the Symptom Logger."
        )
    # Questions about doctor visits/consultations
    elif any(word in msg_lower for word in ["doctor", "appointment", "consultation", "visit", "clinic"]):
        reply = (
            "📋 **Preparing for your doctor consultation**:\n\n"
            "Before your visit:\n"
            "1. ✅ Log all symptoms with dates and severity\n"
            "2. ✅ List current medications (names, doses, frequency)\n"
            "3. ✅ Upload recent medical reports/test results\n"
            "4. ✅ Note questions you want to ask\n\n"
            "During consultation, be ready to discuss:\n"
            "• Timeline of symptoms\n"
            "• What makes symptoms better/worse\n"
            "• Impact on daily activities\n"
            "• Any concerns or fears\n\n"
            "💡 Use **Consultation Prep** to auto-generate a summary and suggested questions!"
        )
    # Default helpful response
    else:
        reply = (
            "Hello! I'm your BuddyDoc health assistant. 👋\n\n"
            "I can help you with:\n"
            "✓ Understanding your symptoms and when to see a doctor\n"
            "✓ Medication guidance and reminders\n"
            "✓ Preparing for your medical consultation\n"
            "✓ Organizing your health information\n\n"
            "💬 **Tell me what's going on:**\n"
            "Just describe your symptoms, health concerns, or questions in your own words - like you're talking to a friend. "
            "The more details you share, the better I can help!"
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
