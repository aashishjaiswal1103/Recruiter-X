def estimate_tokens(text: str) -> int:
    """Estimates the number of tokens in a string.
    Rough approximation: 1 token ~= 4 characters.
    """
    if not text:
        return 0
    return max(1, len(text) // 4)
