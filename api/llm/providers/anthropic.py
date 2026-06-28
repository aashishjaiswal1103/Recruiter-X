from anthropic import AsyncAnthropic, APIStatusError, APITimeoutError as AnthropicTimeout
from api.utils.errors import RateLimitError, APITimeoutError, APIAuthError

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
