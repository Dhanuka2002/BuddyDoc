"""
Quick test script to verify backend setup and agent responses.
Run with: python -m app.test_agents (after installing dependencies)
"""
import asyncio
from app.agents import agent_a, agent_b


async def test_agent_a():
    print("Testing Agent A (Rule-based)...")
    message = "I have a fever and headache since yesterday"
    context = {}
    
    response = await agent_a.respond(message, context)
    
    print(f"  Agent: {response['agent']}")
    print(f"  Confidence: {response['confidence']}")
    print(f"  Response: {response['text']}")
    print(f"  Metadata: {response['metadata']}")
    print()


async def test_agent_b():
    print("Testing Agent B (LLM-backed - stub mode)...")
    message = "What should I tell my doctor about my symptoms?"
    context = {"opt_in_llm": False}
    
    response = await agent_b.respond(message, context)
    
    print(f"  Agent: {response['agent']}")
    print(f"  Confidence: {response['confidence']}")
    print(f"  Response: {response['text']}")
    print(f"  Metadata: {response['metadata']}")
    print()


async def test_concurrent():
    print("Testing concurrent agent calls (like orchestrator)...")
    message = "I'm taking medication for my headache"
    context = {}
    
    task_a = asyncio.create_task(agent_a.respond(message, context))
    task_b = asyncio.create_task(agent_b.respond(message, context))
    
    done, pending = await asyncio.wait([task_a, task_b], timeout=5.0)
    
    print(f"  Completed: {len(done)} agents")
    print(f"  Pending: {len(pending)} agents")
    
    for task in done:
        result = task.result()
        print(f"  - Agent {result['agent']}: {result['text'][:50]}...")
    print()


async def main():
    print("=" * 60)
    print("BuddyDoc Backend - Agent Test Suite")
    print("=" * 60)
    print()
    
    await test_agent_a()
    await test_agent_b()
    await test_concurrent()
    
    print("=" * 60)
    print("All tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
