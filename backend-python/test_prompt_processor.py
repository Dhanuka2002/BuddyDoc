"""
Test script for Prompt Processor Service

This script tests the prompt processor service functionality.
Run this after setting up your environment variables.
"""

import asyncio
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.prompt_processor import get_prompt_processor


async def test_basic_message():
    """Test basic message processing."""
    print("\n=== Test 1: Basic Message Processing ===")
    
    processor = get_prompt_processor()
    message = "I have had a severe headache for 2 days with sensitivity to light"
    
    print(f"Input: {message}")
    result = await processor.process_chat_message(message)
    
    print(f"\nIntent: {result.get('intent')}")
    print(f"Entities: {result.get('entities')}")
    print(f"Medical Concerns: {result.get('medical_concerns')}")
    print(f"Action Required: {result.get('action_required')}")
    print(f"Confidence: {result.get('confidence')}")


async def test_symptom_extraction():
    """Test symptom extraction."""
    print("\n=== Test 2: Symptom Extraction ===")
    
    processor = get_prompt_processor()
    message = "Sharp chest pain on the left side, started this morning, gets worse when I breathe"
    
    print(f"Input: {message}")
    result = await processor.extract_symptoms(message)
    
    print(f"\nSymptoms: {result.get('symptoms')}")
    print(f"Urgency: {result.get('urgency')}")
    print(f"Recommended Action: {result.get('recommended_action')}")
    print(f"Confidence: {result.get('confidence')}")


async def test_with_history():
    """Test message processing with conversation history."""
    print("\n=== Test 3: Message with Conversation History ===")
    
    processor = get_prompt_processor()
    history = [
        "Hi, I need help with my symptoms",
        "I haven't been feeling well lately"
    ]
    message = "I've been having trouble sleeping and feeling anxious"
    
    print(f"History: {history}")
    print(f"Input: {message}")
    
    result = await processor.process_chat_message(message, history)
    
    print(f"\nIntent: {result.get('intent')}")
    print(f"Entities: {result.get('entities')}")
    print(f"Medical Concerns: {result.get('medical_concerns')}")
    print(f"Confidence: {result.get('confidence')}")


async def test_consultation_prep():
    """Test consultation preparation intent."""
    print("\n=== Test 4: Consultation Preparation ===")
    
    processor = get_prompt_processor()
    message = "I have a doctor's appointment tomorrow and want to prepare my questions about my diabetes"
    
    print(f"Input: {message}")
    result = await processor.process_chat_message(message)
    
    print(f"\nIntent: {result.get('intent')}")
    print(f"Entities: {result.get('entities')}")
    print(f"Context: {result.get('context')}")
    print(f"Action Required: {result.get('action_required')}")


async def run_all_tests():
    """Run all tests."""
    try:
        print("=" * 60)
        print("Prompt Processor Service Tests")
        print("=" * 60)
        
        # Check environment variables
        if not os.getenv("GOOGLE_CLOUD_PROJECT"):
            print("\n❌ ERROR: GOOGLE_CLOUD_PROJECT environment variable not set")
            print("Please set up your .env file with GCP credentials")
            return
        
        print(f"\n✓ Project ID: {os.getenv('GOOGLE_CLOUD_PROJECT')}")
        print(f"✓ Location: {os.getenv('GOOGLE_CLOUD_LOCATION', 'us-central1')}")
        
        # Run tests
        await test_basic_message()
        await test_symptom_extraction()
        await test_with_history()
        await test_consultation_prep()
        
        print("\n" + "=" * 60)
        print("✓ All tests completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error running tests: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(run_all_tests())
