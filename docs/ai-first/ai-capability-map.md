# AI Capability Map – ShopLite

| Capability | Intent (user) | Inputs (this sprint) | Risk 1–5 (tag) | p95 ms | Est. cost/action | Fallback | Selected |
|---|---|---|---|---:|---:|---|:---:|
| Support Assistant (FAQ + order status) | Get instant answers about policies, shipping, returns, or check order status | FAQ markdown, order-status API | 2 | 1200 | ~$0.002 | Default FAQ page | ✅ |
| Smart Product Recommender | Show “You may also like” items based on browsing or past orders | Product catalog, browsing history, order history | 3 | 1500 | ~$0.003 | Default “Popular Products” list | ✅ |
| AI-powered Typeahead Search | Suggest products as users type in the search bar | Product catalog, search logs | 3 | 300 | ~$0.001 | ElasticSearch autocomplete | |
| Dynamic Promo Copy | Generate personalized promotional banners or offers | Product tags, user segment | 4 | 2000 | ~$0.004 | Static promo banners | |

---

### Why these two
We selected **Support Assistant** and **Smart Product Recommender** because they directly impact **conversion rate** and **support deflection**—two key business KPIs. The assistant reduces repetitive support contacts by handling FAQ and order tracking instantly, while the recommender increases basket size by surfacing relevant products. Both have **low integration risk** (data/APIs already exist) and measurable ROI within the current sprint scope.
