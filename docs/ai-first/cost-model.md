# Cost Model – ShopLite

## Assumptions
- Model: GPT-4o-mini at $0.15/1K prompt tokens, $0.60/1K completion tokens
- Support Assistant:
  - Avg tokens in: 300
  - Avg tokens out: 150
  - Requests/day: 1,000
  - Cache hit rate: 30%
- Typeahead Search:
  - Avg tokens in: 50
  - Avg tokens out: 20
  - Requests/day: 50,000
  - Cache hit rate: 70%

---

## Calculation

### Support Assistant
Cost/action = (300/1000 × 0.15) + (150/1000 × 0.60)  
= 0.045 + 0.09 = **$0.135**

Daily cost = $0.135 × 1,000 × (1 – 0.30)  
= $0.135 × 700  
= **$94.50/day**

### Typeahead Search
Cost/action = (50/1000 × 0.15) + (20/1000 × 0.60)  
= 0.0075 + 0.012 = **$0.0195**

Daily cost = $0.0195 × 50,000 × (1 – 0.70)  
= $0.0195 × 15,000  
= **$292.50/day**

---

## Results
- Support assistant: Cost/action = **$0.135**, Daily ≈ **$94.50**
- Typeahead search: Cost/action = **$0.0195**, Daily ≈ **$292.50**

---

## Cost lever if over budget
- Support assistant: shorten context (reduce from 300 → 200 tokens avg).  
- Typeahead: downgrade to cheaper Llama 3.1 8B Instruct ($0.05/$0.20), or use embedding-based autocomplete for high-volume paths and reserve AI reranker for cache misses only.

