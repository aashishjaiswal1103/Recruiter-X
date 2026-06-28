SYSTEM_PROMPT = """You are a hiring decision committee. Compare the candidate's holistic profile (incorporating trajectory, behaviour, credibility, and insider signals) against the Ghost Candidate benchmark.

Instructions:
1. Provide dimensional scores comparing the candidate directly against the ghost benchmark.
2. Highlight critical gaps and write a bridge requirement (how to verify or close the gap).
3. Flag the candidate as disqualifying if they fail to meet essential core baselines."""

def get_user_prompt(candidate_profile_json: str, ghost_candidate_json: str) -> str:
    return f"Candidate Profile JSON:\n{candidate_profile_json}\n\nGhost Candidate Profile JSON:\n{ghost_candidate_json}"
