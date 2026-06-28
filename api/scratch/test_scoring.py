import sys
import os
import unittest

# Ensure parent directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.score_fusion import (
    normalise_weights, calculate_risk_penalty, calculate_final_score, diversity_pass
)

class TestScoreFusion(unittest.TestCase):
    def test_normalise_weights(self):
        w = {"ghost_match": 1, "trajectory": 1, "behaviour": 1, "insider_signal": 1, "credibility": 1}
        norm = normalise_weights(w)
        self.assertAlmostEqual(norm["ghost_match"], 0.20)
        self.assertAlmostEqual(norm["insider_signal"], 0.20)

    def test_calculate_risk_penalty_cap(self):
        # 4 High severity flags = 32 points, but should cap at 30
        flags = [
            {"severity": "HIGH"},
            {"severity": "HIGH"},
            {"severity": "HIGH"},
            {"severity": "HIGH"}
        ]
        penalty = calculate_risk_penalty(flags)
        self.assertEqual(penalty, 30)

    def test_calculate_final_score(self):
        scores = {"ghost_match": 80, "trajectory": 80, "behaviour": 80, "insider_signal": 80, "credibility": 80}
        weights = {"ghost_match": 0.25, "trajectory": 0.25, "behaviour": 0.25, "insider_signal": 0.15, "credibility": 0.10}
        flags = [{"severity": "MEDIUM"}, {"severity": "LOW"}] # penalty = 4 + 1 = 5
        
        final_s = calculate_final_score(scores, weights, flags)
        # Weighted avg = 80, penalty = 5, final score = 75
        self.assertEqual(final_s, 75)

    def test_diversity_pass_triggers_correctly(self):
        # 10 candidates with 7 having same company background "CompanyA"
        candidates = [
            {"final_score": 90, "company_background": "CompanyA"},
            {"final_score": 88, "company_background": "CompanyA"},
            {"final_score": 85, "company_background": "CompanyA"},
            {"final_score": 82, "company_background": "CompanyA"},
            {"final_score": 80, "company_background": "CompanyA"},
            {"final_score": 78, "company_background": "CompanyA"},
            {"final_score": 75, "company_background": "CompanyA"}, # 7th overrepresented
            {"final_score": 72, "company_background": "CompanyB"},
            {"final_score": 70, "company_background": "CompanyC"},
            {"final_score": 68, "company_background": "CompanyD"},
            # 11th candidate has different background and score >= 60, should be swapped in
            {"final_score": 65, "company_background": "CompanyE"}
        ]
        
        shuffled, applied = diversity_pass(candidates, "company_background")
        self.assertTrue(applied)
        # Verify that CompanyE is now in the top 10
        top_10_backgrounds = [c["company_background"] for c in shuffled[:10]]
        self.assertIn("CompanyE", top_10_backgrounds)

if __name__ == "__main__":
    unittest.main()
