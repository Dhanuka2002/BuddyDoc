"""
Agent A: Rule-based local agent.
Fast, deterministic; extracts structured fields, prompts missing info.
"""
import asyncio


async def respond(message: str, context: dict) -> dict:
    """
    Simple rule-based logic. In production, add NLP extraction, slot filling, etc.
    """
    # Simulate processing time
    await asyncio.sleep(0.3)

    # Example rule: check for symptom keywords
    lower_msg = message.lower()
    suggestions = []

    if any(kw in lower_msg for kw in ["fever", "headache", "cough", "pain"]):
        suggestions.append("Consider logging when the symptom started and its severity (1-10).")
    
    if any(kw in lower_msg for kw in ["medication", "medicine", "drug"]):
        suggestions.append("Don't forget to note dosage and frequency.")

    if not suggestions:
        suggestions.append("Feel free to describe your symptoms or questions clearly.")

    reply = " ".join(suggestions)

    return {
        "agent": "A",
        "text": reply,
        "confidence": 0.9,
        "metadata": {"type": "rule-based"}
    }
