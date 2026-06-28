# 07. Score Fusion & Ranking Engine

This document specifies the business logic for fusing multi-dimensional AI assessment scores into a single ranked metric, applying risk penalties, preset templates, and a diversity-reshuffling pass.

---

## 1. Core Score Fusion Math

The candidate's final score is calculated using a weighted combination of five AI dimensions, minus a penalty for security and credibility flags.

### Fusing Formula
$$\text{Weighted Score} = \sum_{d \in \text{Dimensions}} (\text{Score}_d \times \text{Weight}_d)$$
$$\text{Final Score} = \max(0, \text{Weighted Score} - \text{Risk Penalty})$$

### Score Weights (Default)
*   **Ghost Match (Role Alignment):** 25% (0.25)
*   **Trajectory (Growth rate & Career Age):** 25% (0.25)
*   **Behaviour (Ownership & Problem Sophistication):** 25% (0.25)
*   **Insider Signal (Practitioner depth):** 15% (0.15)
*   **Credibility (Audit findings & Sincerity):** 10% (0.10)

---

## 2. Risk Penalties

Red flags from the credibility audit subtract points from the final weighted score:
*   **HIGH severity flag:** -8 points each.
*   **MEDIUM severity flag:** -4 points each.
*   **LOW severity flag:** -1 point each.
*   **Maximum Penalty Cap:** 30 points (a candidate cannot lose more than 30 points from red flags).
*   **Floor:** The final score cannot be lower than 0.

---

## 3. Weight Presets

Recruiters can adjust weights via sliders, or apply preset archetypes:

| Preset Name | Ghost Match | Trajectory | Behaviour | Insider Signal | Credibility | Use Case |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **`founding_engineer`** | 20% (0.20) | 35% (0.35) | 30% (0.30) | 10% (0.10) | 5% (0.05) | High autonomy, high-speed builder environments. |
| **`senior_ic`** | 35% (0.35) | 10% (0.10) | 5% (0.05) | 30% (0.30) | 20% (0.20) | Deep technical mastery, compliance, high stability. |
| **`compliance_risk`** | 20% (0.20) | 5% (0.05) | 5% (0.05) | 30% (0.30) | 40% (0.40) | High security clearance or fiduciary trust hires. |
| **`growth_hire`** | 15% (0.15) | 40% (0.40) | 35% (0.35) | 5% (0.05) | 5% (0.05) | Accelerating mid-level hires with high learning rate. |

---

## 4. Diversity Reshuffling Pass

To prevent echo chamber hiring, the final ranking list is passed through a diversity filter.

### Rules
1.  Inspect the top 10 candidates.
2.  If **7 or more** of these top 10 candidates share the exact same company background (e.g. all ex-Google) or educational profile, trigger a reshuffle.
3.  Scan candidates ranked 11–20. If they have a different background and their quality score is **60 or higher**, swap them into the bottom positions of the top 10.
4.  Return the reshuffled list along with a flag `diversity_pass_applied: true` for transparency audit trails.

---

## 5. Code Blueprint (`services/score_fusion.py`)

```python
# services/score_fusion.py
from typing import Dict, List, Any

DEFAULT_WEIGHTS = {
    "ghost_match": 0.25,
    "trajectory": 0.25,
    "behaviour": 0.25,
    "insider_signal": 0.15,
    "credibility": 0.10
}

PRESETS = {
    "founding_engineer": {"ghost": 0.20, "trajectory": 0.35, "behaviour": 0.30, "insider": 0.10, "credibility": 0.05},
    "senior_ic": {"ghost": 0.35, "trajectory": 0.10, "behaviour": 0.05, "insider": 0.30, "credibility": 0.20},
    "compliance_risk": {"ghost": 0.20, "trajectory": 0.05, "behaviour": 0.05, "insider": 0.30, "credibility": 0.40},
    "growth_hire": {"ghost": 0.15, "trajectory": 0.40, "behaviour": 0.35, "insider": 0.05, "credibility": 0.05}
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
```
