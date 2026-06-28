class LLMError(Exception):
    """Base exception class for all LLM-related errors."""
    pass

class RateLimitError(LLMError):
    """Raised when provider-specific API limits or quotas are exceeded (HTTP 429)."""
    pass

class APITimeoutError(LLMError):
    """Raised when the LLM provider API call times out."""
    pass

class APIAuthError(LLMError):
    """Raised when authentication with the LLM provider fails (e.g. invalid API key)."""
    pass

class BudgetExceededError(LLMError):
    """Raised when the estimated input token size exceeds the set budget limit."""
    pass

class SchemaValidationError(LLMError):
    """Raised when the response cannot be validated against the required Pydantic schema."""
    def __init__(self, message: str, raw_output: str = None):
        super().__init__(message)
        self.raw_output = raw_output
