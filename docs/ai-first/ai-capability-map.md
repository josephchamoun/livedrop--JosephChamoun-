# AI Capability Map – ShopLite

| Capability | Intent (user) | Inputs (this sprint) | Risk 1–5 (tag) | p95 ms | Est. cost/action | Fallback | Selected |
|---|---|---|---|---:|---:|---|:---:|
| Support Assistant (FAQ + order status) | Get instant answers about policies, shipping, returns, or check order status | FAQ markdown, `order-status` API | 2 | 1200 | $0.002 | FAQ search + escalate to human | ✅ |
| AI Typeahead Search | Find products faster with smart autocomplete | Product catalog (10k SKUs) | 3 | 300 | $0.0005 | Keyword match fallback | ✅ |
| Personalized Recommendations | See products tailored to my browsing/purchase history | SKU catalog + session history | 4 | 600 | $0.01 | Generic popular items list | ❌ |
| Review Summarization | Quickly skim “what customers say” about a product | Product reviews (structured text) | 3 | 800 | $0.003 | Show raw reviews | ❌ |
| AI-powered Product Description Generator | Auto-generate engaging descriptions for new SKUs | Catalog attributes (name, category, specs) | 5 | N/A (offline batch) | $0.02 | Human copywriter review | ❌ |

---

### Why these two
We selected **Support Assistant** and **AI Typeahead Search** because they directly improve core KPIs with low integration risk.  
- The support assistant can reduce contact rate by answering ~70% of FAQ/order queries instantly, cutting operational costs.  
- The AI-powered typeahead improves product discovery, directly driving conversion by surfacing relevant products within the 300ms target.  
Both use data we already have (FAQs, order API, product catalog), making them feasible within one sprint.

