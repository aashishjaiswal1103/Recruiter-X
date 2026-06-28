import asyncio
import os
import sys
from pydantic import BaseModel, Field

# Ensure project root is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from api.utils.errors import BudgetExceededError, SchemaValidationError, RateLimitError, APITimeoutError, APIAuthError
from api.utils.token_budget import estimate_tokens
from api.llm.router import LLMRouter
from api.llm.schemas import (
    JDAuditSchema, GhostCandidateSchema, TrajectorySchema, 
    BehaviourSchema, CredibilitySchema, InsiderSignalSchema, 
    GhostComparisonSchema, InterrogationSchema
)

# A simple Pydantic schema for tests
class SimpleTestSchema(BaseModel):
    name: str
    score: int = Field(description="Score between 0 and 100")

async def test_token_budget_estimator():
    print("Testing token budget estimator...")
    text = "hello world"  # 11 characters
    assert estimate_tokens(text) == 2, f"Expected 2, got {estimate_tokens(text)}"
    print("OK: Token budget estimator passed.")

async def test_temperature_resolution():
    print("Testing default temperature resolution...")
    router = LLMRouter("mock_key", "openai", "gpt-4o")
    
    assert router._get_default_temp("trajectory") == 0.05
    assert router._get_default_temp("jd_audit") == 0.10
    assert router._get_default_temp("behaviour") == 0.10
    assert router._get_default_temp("ghost_generation") == 0.20
    assert router._get_default_temp("interrogation") == 0.30
    assert router._get_default_temp("unknown_task") == 0.15
    print("OK: Temperature resolution passed.")

async def test_budget_exceeded():
    print("Testing token budget exceeded exception...")
    router = LLMRouter("mock_key", "openai", "gpt-4o")
    
    # trajectory has a budget of max_in: 12000.
    # We pass a prompt of 60000 characters which is ~15000 tokens.
    large_prompt = "A" * 60000
    try:
        await router.complete("trajectory", "System", large_prompt, SimpleTestSchema)
        assert False, "Should have raised BudgetExceededError"
    except BudgetExceededError as e:
        print(f"OK: Budget exceeded check passed (caught expected error: {e})")

async def test_mock_client_validation_success():
    print("Testing parser validation success...")
    router = LLMRouter("mock_key", "openai", "gpt-4o")
    
    # Mocking completion method to return valid JSON
    class MockClient:
        async def complete(self, system, user, model_name, temp, schema):
            return '{"name": "John Doe", "score": 95}'
            
    router.client = MockClient()
    
    result = await router.complete("trajectory", "System", "User", SimpleTestSchema)
    assert result.name == "John Doe"
    assert result.score == 95
    assert isinstance(result, SimpleTestSchema)
    print("OK: Mock parser validation success passed.")

async def test_mock_client_validation_failure():
    print("Testing parser validation failure handling...")
    router = LLMRouter("mock_key", "openai", "gpt-4o")
    
    # Mocking completion method to return invalid JSON
    class MockClient:
        async def complete(self, system, user, model_name, temp, schema):
            return '{"name": "John Doe", "score": "not_an_int"}'
            
    router.client = MockClient()
    
    try:
        await router.complete("trajectory", "System", "User", SimpleTestSchema)
        assert False, "Should have raised SchemaValidationError"
    except SchemaValidationError as e:
        assert "not_an_int" in e.raw_output
        print(f"OK: Parser validation failure handling passed (caught expected error: {e})")

async def run_all_tests():
    print("=== STARTING LLM LAYER TESTS ===")
    await test_token_budget_estimator()
    await test_temperature_resolution()
    await test_budget_exceeded()
    await test_mock_client_validation_success()
    await test_mock_client_validation_failure()
    print("=== ALL MOCK TESTS PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
