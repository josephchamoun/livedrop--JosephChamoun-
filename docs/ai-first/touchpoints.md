# Touchpoint Specs – ShopLite

## 1. Support Assistant (FAQ + order status)

### Problem statement
Customers frequently ask repetitive questions (shipping times, return policy, order status). Human agents spend significant time on these queries, increasing support costs and slowing response times. An AI support assistant can instantly resolve ~70% of these queries, escalating only complex or account-specific issues.

### Happy path
1. User opens support chat or help center.
2. Enters a question (e.g., “Where is my order 12345?”).
3. System checks if query matches FAQ or requires order lookup.
4. If FAQ → retrieve from FAQ markdown, format concise answer.
5. If order → call `order-status` API, format shipping/delivery info.
6. Send query + context to model for answer generation.
7. Model responds within 1200ms p95.
8. UI displays AI answer with option “Still need help?”.
9. If user clicks → escalate to human agent.

### Grounding & guardrails
- Source of truth: FAQ markdown + order-status API.  
- Retrieval scope: Only use internal FAQ and order info.  
- Max context: ≤ 1500 tokens.  
- Out-of-scope queries: refuse and suggest escalation.

### Human-in-the-loop
- Trigger: User rates answer “unhelpful” OR query falls outside FAQ/order scope.  
- UI surface: “Escalate to agent” button.  
- Reviewer: Tier-1 support agent.  
- SLA: Response within 24h (chat/email).

### Latency budget
- Input parsing: 100ms  
- Retrieval (FAQ or API): 400ms  
- Model inference: 600ms  
- Formatting + delivery: 100ms  
**Total ≤ 1200ms p95**

Cache: 30% FAQ queries cached, reducing retrieval + model latency.

### Error & fallback behavior
- FAQ not found → show “I couldn’t find that, would you like to chat with an agent?”  
- API timeout → return generic “We’re checking your order, an agent will follow up.”  
- Model error → show fallback FAQ search result.

### PII handling
- Only order ID leaves the app (no full PII).  
- Redact user names, emails, phone numbers from prompts.  
- Logs: anonymized, no sensitive PII stored.

### Success metrics
- Product: % of FAQ/order queries resolved without human escalation.  
- Product: p95 response time ≤ 1200ms.  
- Business: Support cost reduction = (# resolved by AI ÷ total queries) × avg cost/agent interaction.

### Feasibility note
Data (FAQ markdown and order-status API) already exists. Retrieval can be implemented via lightweight RAG. GPT-4o-mini or similar is suitable. Next prototype step: wire up FAQ + order-status retrieval with a simple UI wrapper.


---

## 2. AI Typeahead Search

### Problem statement
Customers often abandon search if results are slow or irrelevant. Static keyword autocomplete misses intent (e.g., “wirelss headph” should suggest “wireless headphones”). An AI-powered typeahead that predicts relevant products can improve discovery and conversion.

### Happy path
1. User types in search bar (“wirel…”).  
2. Input captured after each keystroke pause (≥200ms).  
3. Check cache for popular queries.  
4. If miss → query AI model with partial text + SKU catalog index.  
5. Model generates top 5 suggestions.  
6. Latency target ≤ 300ms p95.  
7. Display suggestions instantly.  
8. User clicks suggestion → normal product search results load.  
9. Conversion funnel continues as usual.

### Grounding & guardrails
- Source of truth: Product catalog (10k SKUs).  
- Retrieval scope: Only surface SKUs that exist.  
- Max context: ≤ 500 tokens (product names + categories).  
- Out-of-scope: return keyword match fallback.

### Human-in-the-loop
- Trigger: Low CTR (<1% on a suggestion over 1k impressions).  
- UI surface: Admin dashboard with flagged terms.  
- Reviewer: Merchandising manager.  
- SLA: Weekly review of flagged search terms.

### Latency budget
- Keystroke capture/debounce: 50ms  
- Cache lookup: 20ms  
- Model inference: 200ms  
- Response formatting: 30ms  
**Total ≤ 300ms p95**

Cache: 70% hit rate for common queries.

### Error & fallback behavior
- Model error or timeout → revert to keyword autocomplete.  
- If no results → show “No products found” with spelling suggestion.

### PII handling
- No PII in requests (search terms only).  
- Logs may store query text for analytics, stripped of session IDs.  
- No sensitive data leaves app.

### Success metrics
- Product: CTR on search suggestions.  
- Product: Search-to-cart conversion rate uplift.  
- Business: Revenue lift = (conversion uplift × avg order value × search traffic).

### Feasibility note
Product catalog index is available. Approximate nearest-neighbor search can be combined with lightweight AI re-ranking. GPT-4o-mini or smaller models are sufficient. Next prototype step: implement hybrid cache + keyword fallback + AI reranker.

