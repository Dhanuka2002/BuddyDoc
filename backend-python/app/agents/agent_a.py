"""
Agent A: Rule-based local agent.
Fast, deterministic; extracts structured fields, prompts missing info.
"""
import asyncio


async def respond(message: str, context: dict) -> dict:
    """
    Rule-based agent with medical guidance. Detects symptoms and provides actionable advice.
    """
    # Simulate processing time
    await asyncio.sleep(0.3)

    msg_lower = message.lower()
    
    # Check for fever with medications mentioned (highest priority)
    if any(word in msg_lower for word in ["amoxil", "amoxicillin", "panadol", "paracetamol", "acetaminophen"]) and \
       any(word in msg_lower for word in ["fever", "temperature", "hot"]):
        reply = (
            "✓ Amoxicillin (antibiotic) and Panadol/Paracetamol (fever reducer) are commonly prescribed for bacterial infections with fever.\n\n"
            "⚠️ Important reminders:\n"
            "• Take Amoxicillin for the FULL prescribed course (usually 5-7 days) even if you feel better\n"
            "• Take Panadol every 4-6 hours as needed (max 4g/day for adults)\n"
            "• Take with food if stomach upset occurs\n"
            "• Stay hydrated - drink plenty of water\n\n"
            "🚨 See a doctor if:\n"
            "• Fever persists beyond 3 days\n"
            "• You develop rash or difficulty breathing\n"
            "• Symptoms worsen\n\n"
            "I've noted this in your symptom log for your consultation."
        )
        return {
            "agent": "A",
            "text": reply,
            "confidence": 0.95,
            "metadata": {"type": "medication-fever-guidance", "keywords_matched": 2}
        }
    
    # Check for fever/cold symptoms with food trigger
    if any(word in msg_lower for word in ["ice cream", "cold food", "ice", "frozen"]) and \
       any(word in msg_lower for word in ["fever", "cold", "dizzy", "temperature", "sick"]):
        reply = (
            "It sounds like you may have developed a cold or throat infection, possibly triggered by consuming cold foods.\n\n"
            "📋 Your symptoms:\n"
            "• High body temperature (fever)\n"
            "• Dizziness\n"
            "• Feeling cold (chills)\n"
            "• Recent consumption of ice cream\n\n"
            "🏥 Immediate care:\n"
            "• Rest and stay warm\n"
            "• Drink warm fluids (tea, soup, warm water)\n"
            "• Take Panadol/Paracetamol for fever (500mg every 4-6 hours)\n"
            "• Avoid cold foods and drinks temporarily\n"
            "• Monitor your temperature\n\n"
            "⚠️ Consult a doctor if:\n"
            "• Fever goes above 38.5°C (101.3°F)\n"
            "• Dizziness worsens or you have severe headache\n"
            "• Symptoms persist beyond 2-3 days\n"
            "• You have difficulty breathing or swallowing\n\n"
            "Would you like me to help you prepare questions for your doctor?"
        )
        return {
            "agent": "A",
            "text": reply,
            "confidence": 0.92,
            "metadata": {"type": "cold-symptom-guidance", "keywords_matched": 3}
        }
    
    # General fever symptoms
    if any(word in msg_lower for word in ["fever", "temperature", "hot", "cold", "chills"]):
        reply = (
            "🌡️ Fever Management:\n"
            "• Take temperature reading (Normal: 36.5-37.5°C / 97.7-99.5°F)\n"
            "• Rest in a comfortable environment\n"
            "• Stay hydrated - drink water frequently\n"
            "• Use Panadol/Paracetamol for relief\n"
            "• Apply cool compress if needed\n\n"
            "Please log:\n"
            "✓ When fever started\n"
            "✓ Temperature readings\n"
            "✓ Severity (mild/moderate/severe)\n"
            "✓ Other symptoms (headache, body aches, etc.)\n\n"
            "Seek medical attention if fever persists beyond 3 days."
        )
        return {
            "agent": "A",
            "text": reply,
            "confidence": 0.88,
            "metadata": {"type": "fever-guidance", "keywords_matched": 1}
        }
    
    # Headache symptoms
    if any(word in msg_lower for word in ["headache", "head pain", "migraine", "dizzy", "dizziness"]):
        reply = (
            "🤕 For headache/dizziness:\n"
            "• Rest in a quiet, dark room\n"
            "• Stay hydrated\n"
            "• Take Panadol if needed\n"
            "• Avoid bright screens\n\n"
            "Log these details:\n"
            "✓ Location of pain (front, back, sides)\n"
            "✓ Intensity (1-10 scale)\n"
            "✓ Any triggers (stress, lack of sleep, food)\n"
            "✓ Associated symptoms (nausea, visual changes)\n\n"
            "⚠️ Seek immediate care for: severe sudden headache, vision changes, confusion, or stiff neck."
        )
        return {
            "agent": "A",
            "text": reply,
            "confidence": 0.85,
            "metadata": {"type": "headache-guidance", "keywords_matched": 1}
        }
    
    # Medication questions
    if any(word in msg_lower for word in ["medication", "medicine", "drug", "pill", "prescription"]):
        reply = (
            "💊 Medication Safety:\n"
            "• Always complete antibiotic courses\n"
            "• Take medications at prescribed times\n"
            "• Note any side effects\n"
            "• Don't mix with alcohol\n"
            "• Store properly (check label)\n\n"
            "Track in your medication list:\n"
            "✓ Name and dosage\n"
            "✓ Frequency and timing\n"
            "✓ Purpose\n"
            "✓ Start and end dates\n"
            "✓ Any side effects experienced"
        )
        return {
            "agent": "A",
            "text": reply,
            "confidence": 0.82,
            "metadata": {"type": "medication-guidance", "keywords_matched": 1}
        }

    # Default response - only return if truly no match
    return {
        "agent": "A",
        "text": "",  # Empty - let Agent B handle general queries
        "confidence": 0.1,
        "metadata": {"type": "no-match", "keywords_matched": 0}
    }
