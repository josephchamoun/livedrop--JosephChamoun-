AI Capability Map – ShopLite

Capability: Support Assistant (FAQ + order status)
Intent (user): Get instant answers about policies, shipping, returns, or check order status
Inputs (this sprint): FAQ markdown, order-status API
Risk 1–5 (tag): 2
p95 ms: 1200
Est. cost/action: ~$0.002
Fallback: Default FAQ page
Selected: Yes

Capability: Smart Product Recommender
Intent (user): Show “You may also like” items based on browsing or past orders
Inputs (this sprint): Product catalog, browsing history, order history
Risk 1–5 (tag): 3
p95 ms: 1500
Est. cost/action: ~$0.003
Fallback: Default “Popular Products” list
Selected: Yes

Capability: Customer Sentiment Analyzer
Intent (user): Detect frustrated or happy customers from messages
Inputs (this sprint): Chat logs
Risk 1–5 (tag): 4
p95 ms: 1600
Est. cost/action: ~$0.0025
Fallback: Manual escalation
Selected: No

Capability: Delivery ETA Predictor
Intent (user): Give better shipping time estimates
Inputs (this sprint): Order + courier API data
Risk 1–5 (tag): 4
p95 ms: 1500
Est. cost/action: ~$0.03
Fallback: Default courier estimate
Selected: No

Why these two:
We selected Support Assistant and Smart Product Recommender because they directly impact conversion rate and support deflection—two key business KPIs. The assistant reduces repetitive support contacts by handling FAQ and order tracking instantly, while the recommender increases basket size by surfacing relevant products. Both have low integration risk (data/APIs already exist) and measurable ROI within the current sprint scope.
