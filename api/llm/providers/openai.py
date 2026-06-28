from openai import AsyncOpenAI, APIError, APITimeoutError as OpenAITimeout
from api.utils.errors import RateLimitError, APITimeoutError, APIAuthError

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
