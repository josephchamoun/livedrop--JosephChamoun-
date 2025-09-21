# AI Capability Map – ShopLite

| Capability | Intent (user) | Inputs (this sprint) | Risk 1–5 (tag) | p95 ms | Est. cost/action | Fallback | Selected |
|---|---|---|---|---:|---:|---|:---:|
| Support Assistant (FAQ + order status) | Get instant answers about policies, shipping, returns, or check order status | FAQ markdown, order-status API | 2 | 1200 | ~$0.002 | Default FAQ page | ✅ |
| Smart Product Recommender | Show “You may also like” items based on browsing or past orders | Product catalog, browsing history, order history | 3 | 1500 | ~$0.003 | Default “Popular Products” list | ✅ |
| Customer Sentiment Analyzer | Detect frustrated or happy customers from messages | Chat logs | 4 | 1600 | ~$0.0025 | Manual escalation | ❌ |
| Delivery ETA Predictor | Give better shipping time estimates | Order + courier API data | 4 | — | — | Default courier estimate | ❌ |

---

### Why these two
We selected **Support Assistant** and **Smart Product Recommender** because they directly impact **conversion rate** and **support deflection**—two key business KPIs. The assistant reduces repetitive support contacts by handling FAQ and order tracking instantly, while the recommender increases basket size by surfacing relevant products. Both have **low integration risk** (data/APIs already exist) and measurable ROI within the current sprint scope.
