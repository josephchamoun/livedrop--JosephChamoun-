# RAG System Evaluation

This document defines a **manual evaluation framework** for testing retrieval and generation quality of the RAG system.

---

## Retrieval Quality Tests (10 tests)

| Test ID | Question | Expected Documents | Pass Criteria |
|---------|----------|--------------------|---------------|
| R01 | How do I create a seller account on Shoplite? | Seller Account Setup and Management | Retrieved docs contain "Seller Account Setup and Management" |
| R02 | What is Shoplite's return policy? | Returns and Refund Policy | Retrieved docs contain "Returns and Refund Policy" |
| R03 | How does Shoplite handle payments? | Payment Processing and Security | Retrieved docs contain "Payment Processing and Security" |
| R04 | What is the delivery time for orders? | Shipping and Delivery | Retrieved docs contain "Shipping and Delivery" |
| R05 | How do I reset my Shoplite password? | Account Management and Security | Retrieved docs contain "Account Management and Security" |
| R06 | Does Shoplite offer seller support? | Seller Account Setup and Management, Customer Support Procedures | Retrieved docs contain at least one expected document |
| R07 | What customer support options are available? | Customer Support Procedures | Retrieved docs contain "Customer Support Procedures" |
| R08 | How are disputes resolved on Shoplite? | Buyer and Seller Protection Policy | Retrieved docs contain "Buyer and Seller Protection Policy" |
| R09 | Are there transaction fees for sellers? | Seller Account Setup and Management, Payment Processing and Security | Retrieved docs contain relevant fee details |
| R10 | How can I track my order? | Order Tracking | Retrieved docs contain "Order Tracking" |

---

## Response Quality Tests (15 tests)

| Test ID | Question | Required Keywords | Forbidden Terms | Expected Behavior |
|---------|----------|-------------------|-----------------|-------------------|
| Q01 | How do I create a seller account? | ["seller registration", "business verification", "2-3 business days"] | ["instant approval"] | Explains registration, mentions verification delay |
| Q02 | What is Shoplite's return policy? | ["return", "refund", "30 days"] | ["no returns"] | Clear, concise policy with timeframe |
| Q03 | How does payment security work? | ["encryption", "fraud detection"] | ["unsafe"] | Explains security layers |
| Q04 | What are the shipping options? | ["standard", "express"] | ["no shipping"] | Lists available delivery types |
| Q05 | How do I reset my password? | ["reset", "verification link"] | ["impossible"] | Explains password recovery |
| Q06 | Does Shoplite provide seller support? | ["dedicated channel", "help center"] | ["no support"] | Mentions support options |
| Q07 | What customer support options are available? | ["live chat", "email", "phone", "24/7"] | ["no support"] | Lists all available channels |
| Q08 | How are disputes resolved? | ["resolution center", "buyer protection"] | ["no process"] | Describes dispute resolution |
| Q09 | What are the seller fees? | ["transaction fee", "commission"] | ["free forever"] | Explains fee structure |
| Q10 | How do I track my order? | ["tracking ID", "status updates"] | ["not possible"] | Explains tracking process |
| Q11 | Can I cancel an order? | ["cancellation", "before shipment"] | ["never allowed"] | Describes cancellation rules |
| Q12 | How are returns processed? | ["inspection", "refund issued"] | ["automatic approval"] | Explains return steps |
| Q13 | What are Shoplite’s account security features? | ["2FA", "encryption"] | ["insecure"] | Explains account protection |
| Q14 | What payment methods are accepted? | ["credit card", "PayPal", "Shoplite Wallet"] | ["cash only"] | Lists payment methods |
| Q15 | Does Shoplite protect buyers? | ["fraud protection", "guarantee"] | ["unprotected"] | Explains buyer protection |

---

## Edge Case Tests (5 tests)

| Test ID | Scenario | Expected Response Type |
|---------|----------|------------------------|
| E01 | Question about a product not in the knowledge base | Refusal with explanation ("not in docs") |
| E02 | Vague question ("How does it work?") | Ask for clarification |
| E03 | Off-topic question (e.g., "What’s the weather?") | Refusal, state out-of-scope |
| E04 | Contradictory question ("Can I return items after 1 year?") | Correction using policy (30 days) |
| E05 | Question mixing multiple domains ("How to create an account and get refund?") | Split answer, cover both parts |



