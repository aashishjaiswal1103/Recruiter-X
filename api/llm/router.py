from api.utils.errors import BudgetExceededError, SchemaValidationError
from api.utils.token_budget import estimate_tokens 
from api.llm.providers import GeminiClient, AnthropicClient, OpenAIClient

BUDGETS = {
    "trajectory": {"max_in": 12000, "max_out": 2000},
    "credibility": {"max_in": 12000, "max_out": 2000},
    "behaviour": {"max_in": 12000, "max_out": 2000},
    "ghost_generation": {"max_in": 16000, "max_out": 4000},
}

class LLMRouter:
    def __init__(self, api_key: str, provider: str, model: str):
        self.provider = provider
        self.model = model
        self.client = self._init_client(api_key)

    def _init_client(self, api_key: str):
        if self.provider == "gemini":
            return GeminiClient(api_key)
        elif self.provider == "anthropic":
            return AnthropicClient(api_key)
        elif self.provider == "openai":
            return OpenAIClient(api_key)
        raise ValueError(f"Unknown provider: {self.provider}")

    async def complete(self, task_type: str, system_prompt: str, user_prompt: str, schema, temp_override: float = None):
        # 1. Enforce Token Budgets
        estimated_input_tokens = estimate_tokens(system_prompt + user_prompt)
        budget = BUDGETS.get(task_type, {"max_in": 8000, "max_out": 2000})
        
        if estimated_input_tokens > budget["max_in"]:
            raise BudgetExceededError(
                f"Input tokens ({estimated_input_tokens}) exceed budget limit ({budget['max_in']}) for {task_type}."
            )
            
        # 2. Resolve Temperature
        temp = temp_override if temp_override is not None else self._get_default_temp(task_type)
        
        # 3. Request Completion
        raw_json = await self.client.complete(system_prompt, user_prompt, self.model, temp, schema)
        
        # 4. Parse & Validate Pydantic Schema
        try:
            validated_object = schema.model_validate_json(raw_json)
            return validated_object
        except Exception as e:
            # Raise exception containing the raw text for downstream troubleshooting
            raise SchemaValidationError(f"Response validation failed: {str(e)}", raw_output=raw_json)

    def _get_default_temp(self, task_type: str) -> float:
        temps = {
            "trajectory": 0.05,
            "credibility": 0.05,
            "jd_audit": 0.10,
            "ghost": 0.10,
            "pool": 0.10,
            "ghost_generation": 0.20,
            "behaviour": 0.10,
            "interrogation": 0.30
        }
        return temps.get(task_type, 0.15)
