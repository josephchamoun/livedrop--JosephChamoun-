AI Touchpoints – Specs

1) Support Assistant (FAQ + Order Status)

Problem statement
Customers frequently ask about return policies, shipping timelines, and order status. Current FAQ pages are static, and order lookups require manual navigation. This leads to high support ticket volume and slower resolution times.

Happy path

1. User opens chat or help widget.

2. Enters a query like “Where is my order?” or “What’s your return policy?”

3. System classifies intent (FAQ vs. order status).

4. If FAQ: retrieve relevant markdown section.

5. If order: call order-status API using order ID provided.

6. Pass structured context + query to model.

7. Model generates concise answer.

8. Answer is shown in chat UI with citations (FAQ link or order number).

9. If confidence < threshold → escalate to human.

10. User receives resolution within latency budget.

Grounding & guardrails

- Source of truth: FAQ markdown, order-status API

- Retrieval scope: strictly scoped to FAQ + order API responses

- Max context: 1.5k tokens

- Refusal policy: reject questions outside of scope (e.g., “What’s the weather?”)

Human-in-the-loop

- Escalation if confidence < 0.75 or if API fails

- UI: “Contact support” button in chat widget

- Reviewer: human agent in helpdesk tool

- SLA: respond within 2 hours

Latency budget (≤1200 ms)

- Query classification: 100 ms

- FAQ/API retrieval: 300 ms

- Model inference: 600 ms

- UI render: 200 ms

- Cache: 30% FAQ hits served instantly (~100 ms)

Error & fallback behavior

- API failure → fallback to human agent

- Model timeout → return FAQ link or default “contact support” message

PII handling

- Only order ID leaves the app, redacted logs

- No storage of user free-text queries beyond 7 days

- Audit logs scrubbed of personal details

Success metrics

- Product: % FAQ deflected = (FAQ queries answered / total FAQ queries) × 100

- Product: Avg response latency ≤ 1200 ms at p95

- Business: Support contact reduction = (tickets pre-AI – tickets post-AI) ÷ tickets pre-AI × 100

Feasibility note
FAQ markdown and order API already exist. Retrieval + classification can be done with a lightweight pipeline. Prototype can use OpenRouter or GPT-4o-mini for quick feasibility. Next step: implement small FAQ probe with cached embeddings.

2) Smart Product Recommender

Problem statement
Shoppers often leave without exploring more products. Current recommendations are static (bestsellers), not tailored to user activity. This reduces cross-sell and upsell opportunities.

Happy path

1. User views a product page.

2. System logs browsing and purchase history.

3. When rendering the page, a recommendation request is made.

4. Context = viewed product, recent browsing, past orders.

5. Model ranks candidate products by similarity & relevance.

6. Top 3–5 recommendations returned.

7. Shown under “You may also like” section.

8. User clicks on a recommended product.

9. Metrics logged (CTR, conversion).

10. Cache frequently served recommendations for popular products.

Grounding & guardrails

- Source of truth: product catalog, purchase history, browsing history

- Scope: only products in catalog (no hallucinations)

- Max context: 2k tokens (product embeddings)

- Refusal: if no data available, fallback to “Popular Products”

Human-in-the-loop

- Escalation: if click-through rate < 5% for a product set → flagged for merchandiser review

- UI: analytics dashboard for merch team

- SLA: review flagged products within 7 days

Latency budget (≤1500 ms)

- Context prep: 400 ms

- Candidate retrieval: 500 ms

- Model ranking: 400 ms

- UI render: 200 ms

- Cache: top product combos cached (70% hit)

Error & fallback behavior

- API or model failure → fallback to static bestseller list

- Timeout → default “Popular Products” shown instantly

PII handling

 -Only anonymized browsing/purchase history sent to model

- Strip user IDs before logging

- Logs retained max 30 days

Success metrics

- Product: CTR on recommended products = clicks ÷ impressions × 100

- Product: Conversion uplift = (purchases via recs ÷ total purchases) × 100

- Business: Average order value (AOV) uplift = (AOV with recs – baseline AOV) ÷ baseline AOV × 100

Feasibility note
Catalog and order history already exist in DB. Embeddings can be pre-computed for products. A small-scale recommender can be prototyped with OpenRouter LLaMA 3.1 8B or vector search. Next step: build proof-of-concept with a sample of 1k products.
