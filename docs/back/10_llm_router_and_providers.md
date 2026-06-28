# 10. LLM Router & Providers

This document details the architecture of the LLM Layer, specifically how client wrappers, exception normalization, token budgets, and unified routing are implemented.

---

## 1. Unified Error Hierarchy (`utils/errors.py`)

All provider-specific SDK exceptions must be caught by provider clients and re-raised as unified exceptions. This prevents vendor-specific imports from leaking into core task logic.

```text
Exception
 └── LLMError
      ├── RateLimitError          # 429 quota exhaustion
      ├── APITimeoutError         # Request timeout / latency issues
      ├── APIAuthError            # Invalid BYOK keys / bad signature
      ├── BudgetExceededError     # Request token size exceeds budget limits
      └── SchemaValidationError   # Provider failed to return valid schema JSON
```

---

## 2. Provider Clients (`llm/providers/`)

Each provider client implements an asynchronous `complete()` method that takes `system: str`, `user: str`, `model_name: str`, `temperature: float`, and `response_schema: Type[BaseModel]`.

### 1. Google Gemini Wrapper (`llm/providers/gemini.py`)
Uses the `google-generativeai` SDK. Leverages native schema enforcement:

```python
# llm/providers/gemini.py
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, DeadlineExceeded
from google.auth.exceptions import TransportError
from utils.errors import RateLimitError, APITimeoutError, APIAuthError

class GeminiClient:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)

    async def complete(self, system: str, user: str, model_name: str, temperature: float, schema) -> str:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config={
                    "temperature": temperature,
                    "response_mime_type": "application/json",
                    "response_schema": schema # Pydantic class
                },
                system_instruction=system
            )
            response = await model.generate_content_async(user)
            return response.text
        except ResourceExhausted:
            raise RateLimitError("Gemini API quota exceeded.")
        except DeadlineExceeded:
            raise APITimeoutError("Gemini API request timed out.")
        except TransportError:
            raise APIAuthError("Gemini authentication failed. Verify your key.")
```

### 2. Anthropic Claude Wrapper (`llm/providers/anthropic.py`)
Uses the `anthropic` SDK. Forces structured output using tools:

```python
# llm/providers/anthropic.py
from anthropic import AsyncAnthropic, APIStatusError, APITimeoutError as AnthropicTimeout
from utils.errors import RateLimitError, APITimeoutError, APIAuthError

class AnthropicClient:
    def __init__(self, api_key: str):
        self.client = AsyncAnthropic(api_key=api_key)

    async def complete(self, system: str, user: str, model_name: str, temperature: float, schema) -> str:
        # Extract json_schema from Pydantic model
        json_schema = schema.model_json_schema()
        
        try:
            response = await self.client.messages.create(
                model=model_name,
                max_tokens=4000,
                temperature=temperature,
                system=system,
                messages=[{"role": "user", "content": user}],
                # Enforce structured output via tool parameters
                tools=[{
                    "name": "output_schema",
                    "description": "Output schema mapping structure.",
                    "input_schema": json_schema
                }],
                tool_choice={"type": "tool", "name": "output_schema"}
            )
            # Find and extract tool_use block
            for content_block in response.content:
                if content_block.type == "tool_use":
                    import json
                    return json.dumps(content_block.input)
            raise ValueError("Anthropic API failed to call output_schema tool.")
        except AnthropicTimeout:
            raise APITimeoutError("Anthropic API call timed out.")
        except APIStatusError as e:
            if e.status_code == 429:
                raise RateLimitError("Anthropic API rate limit exceeded.")
            elif e.status_code == 401:
                raise APIAuthError("Anthropic API key is invalid.")
            raise
```

### 3. OpenAI Wrapper (`llm/providers/openai.py`)
Uses the `openai` SDK. Leverages native Pydantic parsing:

```python
# llm/providers/openai.py
from openai import AsyncOpenAI, APIError, APITimeoutError as OpenAITimeout
from utils.errors import RateLimitError, APITimeoutError, APIAuthError

class OpenAIClient:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def complete(self, system: str, user: str, model_name: str, temperature: float, schema) -> str:
        try:
            completion = await self.client.beta.chat.completions.parse(
                model=model_name,
                temperature=temperature,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user}
                ],
                response_format=schema # Direct Pydantic model
            )
            return completion.choices[0].message.content
        except OpenAITimeout:
            raise APITimeoutError("OpenAI API call timed out.")
        except APIError as e:
            if e.status_code == 429:
                raise RateLimitError("OpenAI API rate limit exceeded.")
            elif e.status_code == 401:
                raise APIAuthError("OpenAI API key is invalid.")
            raise
```

---

## 3. The LLMRouter (`llm/router.py`)

The `LLMRouter` orchestrates calls, manages task temperatures, and validates output against schemas.

### 1. Default Parameters
The router enforces task-specific temperatures:

| Task Type | Temperature | Rationale |
| :--- | :---: | :--- |
| `trajectory` / `credibility` | `0.05` | Low variance, highly analytical fact checking. |
| `jd_audit` / `ghost` / `pool` | `0.10` | Structuring facts with minimal inference. |
| `behaviour` | `0.10` | Objective tone classification. |
| `ghost_generation` | `0.20` | Synthesizing details based on requirements. |
| `interrogation` | `0.30` | Generating creative surgical interview questions. |

### 2. Token Budget Checks
To prevent runaway billing and API failures, the router checks token bounds *before* sending requests:

```python
# llm/router.py
from utils.errors import BudgetExceededError, SchemaValidationError
# Simple token estimation function (e.g. 1 token ~= 4 characters)
from utils.token_budget import estimate_tokens 

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
```
