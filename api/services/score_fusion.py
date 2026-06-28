from typing import Dict, List, Any

DEFAULT_WEIGHTS = {
    "ghost_match": 0.25,
    "trajectory": 0.25,
    "behaviour": 0.25,
    "insider_signal": 0.15,
    "credibility": 0.10
}

PRESETS = {
    "founding_engineer": {"ghost_match": 0.20, "trajectory": 0.35, "behaviour": 0.30, "insider_signal": 0.10, "credibility": 0.05},
    "senior_ic": {"ghost_match": 0.35, "trajectory": 0.10, "behaviour": 0.05, "insider_signal": 0.30, "credibility": 0.20},
    "compliance_risk": {"ghost_match": 0.20, "trajectory": 0.05, "behaviour": 0.05, "insider_signal": 0.30, "credibility": 0.40},
    "growth_hire": {"ghost_match": 0.15, "trajectory": 0.40, "behaviour": 0.35, "insider_signal": 0.05, "credibility": 0.05}
}

def normalise_weights(weights: Dict[str, float]) -> Dict[str, float]:
    total = sum(weights.values())
    if total == 0:
        return DEFAULT_WEIGHTS
    return {k: v / total for k, v in weights.items()}

def calculate_risk_penalty(red_flags: List[Dict[str, Any]]) -> int:
    penalty = 0
    for flag in red_flags:
        severity = flag.get("severity", "LOW").upper()
        if severity == "HIGH":
            penalty += 8
        elif severity == "MEDIUM":
            penalty += 4
        else:
            penalty += 1
            
    return min(penalty, 30)

def calculate_final_score(scores: Dict[str, int], weights: Dict[str, float], red_flags: List[Dict[str, Any]]) -> int:
    norm_w = normalise_weights(weights)
    
    # Calculate weighted average
    weighted_sum = sum(scores.get(dim, 0) * norm_w.get(dim, 0.0) for dim in norm_w.keys())
    
    # Calculate penalty
    penalty = calculate_risk_penalty(red_flags)
    
    final_score = max(0, int(weighted_sum - penalty))
    return final_score

def diversity_pass(candidates: List[Dict[str, Any]], background_field: str = "company_background") -> tuple[List[Dict[str, Any]], bool]:
    if len(candidates) < 10:
        return candidates, False
        
    top_10 = candidates[:10]
    remaining = candidates[10:]
    
    # Check background distribution
    backgrounds = [c.get(background_field) for c in top_10 if c.get(background_field)]
    if not backgrounds:
        return candidates, False
        
    from collections import Counter
    counts = Counter(backgrounds)
    most_common, frequency = counts.most_common(1)[0]
    
    # If 7 or more share the same background, we trigger the swap
    if frequency >= 7:
        swapped = False
        for i in range(len(remaining)):
            candidate_to_swap = remaining[i]
            # Verify candidate has a different background and score is above threshold
            if (candidate_to_swap.get(background_field) != most_common 
                and candidate_to_swap.get("final_score", 0) >= 60):
                
                # Find the lowest scoring candidate in the top 10 that shares the overrepresented background
                for idx in reversed(range(10)):
                    if top_10[idx].get(background_field) == most_common:
                        # Perform the swap
                        top_10[idx], remaining[i] = candidate_to_swap, top_10[idx]
                        swapped = True
                        break
                if swapped:
                    break
        if swapped:
            # Re-sort lists to maintain ranking integrity
            top_10.sort(key=lambda x: x.get("final_score", 0), reverse=True)
            return top_10 + remaining, True
            
    return candidates, False
