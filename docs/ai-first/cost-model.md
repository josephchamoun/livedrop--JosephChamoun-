# Cost Model – ShopLite AI Touchpoints

---

## Assumptions
- Model: Llama 3.1 8B Instruct via OpenRouter  
- Price: $0.05 / 1K prompt tokens, $0.20 / 1K completion tokens  
- Support Assistant: Avg in = 300 tokens, Avg out = 100 tokens  
- Smart Recommender: Avg in = 500 tokens, Avg out = 150 tokens  
- Requests/day: Support = 1,000 (30% cache), Recommender = 2,000 (50% cache)

---

## Calculation

**Formula:**  
Cost/action = (tokens_in ÷ 1000 × prompt_price) + (tokens_out ÷ 1000 × completion_price)  
Daily cost = Cost/action × Requests/day × (1 – cache_hit_rate)

### Support Assistant
- Cost/action = (300/1000 × 0.05) + (100/1000 × 0.20)  
= $0.015 + $0.020 = **$0.035**  
- Daily = 0.035 × 1000 × (1 – 0.3)  
= **$24.50/day** (~$735/month)

### Smart Product Recommender
- Cost/action = (500/1000 × 0.05) + (150/1000 × 0.20)  
= $0.025 + $0.030 = **$0.055**  
- Daily = 0.055 × 2000 × (1 – 0.5)  
= **$55/day** (~$1650/month)

---

## Results
- Support Assistant: $0.035/action, ~$735/month  
- Smart Recommender: $0.055/action, ~$1650/month  
- **Total ≈ $2,385/month**

---

## Cost levers if over budget
- Reduce context size (shorter FAQ snippets, limit product features).  
- Switch to cheaper tier model for low-risk queries.  
- Aggressively cache popular FAQ responses and top product recommendations.  
