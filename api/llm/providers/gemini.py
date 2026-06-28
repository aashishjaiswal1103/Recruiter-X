import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, DeadlineExceeded
from google.auth.exceptions import TransportError
from api.utils.errors import RateLimitError, APITimeoutError, APIAuthError

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
            # generate_content_async is an async call in google-generativeai
            response = await model.generate_content_async(user)
            return response.text
        except ResourceExhausted:
            raise RateLimitError("Gemini API quota exceeded.")
        except DeadlineExceeded:
            raise APITimeoutError("Gemini API request timed out.")
        except TransportError:
            raise APIAuthError("Gemini authentication failed. Verify your key.")
        except Exception as e:
            # Fallback wrapper for any other genai exceptions
            raise APITimeoutError(f"Gemini API error: {str(e)}")
