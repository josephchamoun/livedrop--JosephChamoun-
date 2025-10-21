E-Commerce API Backend

RESTful API with MongoDB Atlas, Server-Sent Events, and Intelligent Support Assistant

Overview
This is the backend API for a full-stack e-commerce platform featuring real-time order tracking, intelligent customer support with intent detection and function calling, and comprehensive analytics.
Features

✅ RESTful API with MongoDB Atlas (cloud database)
✅ Real-time order tracking via Server-Sent Events (SSE)
✅ Intelligent support assistant with 7 intent types
✅ Function calling system (order status, product search, customer orders)
✅ Citation validation against knowledge base
✅ Database aggregation for analytics
✅ Admin dashboard metrics
✅ Simple user identification (email-based, no authentication)


Tech Stack

Runtime: Node.js
Framework: Express.js
Database: MongoDB Atlas (free tier)
LLM Integration: Google Colab + ngrok (Week 3 deployment)
Hosting: Render.com / Railway.app (free tier)


Project Structure
/apps/api/
├── README.md
├── package.json
├── .env.example
├── src/
│   ├── server.js                 # Main server entry point
│   ├── db.js                     # MongoDB connection
│   ├── routes/
│   │   ├── customers.js          # Customer lookup (no auth)
│   │   ├── products.js           # Product CRUD
│   │   ├── orders.js             # Order management
│   │   ├── analytics.js          # Revenue analytics
│   │   └── dashboard.js          # Dashboard metrics
│   ├── sse/
│   │   └── order-status.js       # Real-time order updates
│   └── assistant/
│       ├── intent-classifier.js  # Intent detection
│       ├── function-registry.js  # Function calling system
│       └── engine.js             # Assistant orchestration

Database Schema
Collections
customers
javascript{
  _id: ObjectId,
  name: String,
  email: String,        // Unique identifier
  phone: String,
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  },
  createdAt: Date
}
products
javascript{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  tags: [String],
  imageUrl: String,
  stock: Number
}
orders
javascript{
  _id: ObjectId,
  customerId: ObjectId,
  items: [
    {
      productId: ObjectId,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  status: String,       // PENDING, PROCESSING, SHIPPED, DELIVERED
  carrier: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  createdAt: Date,
  updatedAt: Date
}

API Endpoints
Customers (Simple Identification)
httpGET /api/customers?email=user@example.com
Look up customer by email (returns customer profile)
httpGET /api/customers/:id
Get customer profile by ID

Products
httpGET /api/products?search=&tag=&sort=&page=&limit=
List products with filtering, sorting, and pagination
httpGET /api/products/:id
Get single product details
httpPOST /api/products
Create new product (body: { name, description, price, category, tags, imageUrl, stock })

Orders
httpPOST /api/orders
Create new order (body: { customerId, items: [{ productId, quantity }] })
httpGET /api/orders/:id
Get order details
httpGET /api/orders?customerId=:customerId
Get all orders for a specific customer

Real-Time Order Tracking (SSE)
httpGET /api/orders/:id/stream
Server-Sent Events stream for live order status updates
Auto-Simulation:

Automatically progresses order through statuses: PENDING → PROCESSING → SHIPPED → DELIVERED
Updates database at each status change
Sends SSE event to client in real-time
Closes stream when order reaches DELIVERED
Status progression timing: 3-7 seconds between each change


Analytics
httpGET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
Get daily revenue aggregated by date (uses MongoDB aggregation pipeline)
Returns:
json[
  { "date": "2025-10-15", "revenue": 1250.50, "orderCount": 15 },
  { "date": "2025-10-16", "revenue": 980.25, "orderCount": 12 }
]
httpGET /api/analytics/dashboard-metrics
Get overall business metrics (total revenue, orders, avg order value)

Dashboard Metrics
httpGET /api/dashboard/business-metrics
Business KPIs: revenue, order count, average order value, revenue trend
httpGET /api/dashboard/performance
System performance: API latency, active SSE connections, error rates
httpGET /api/dashboard/assistant-stats
Assistant analytics: intent distribution, function calls, response times

Intelligent Assistant
httpPOST /api/assistant/chat
Send message to intelligent support assistant
Request Body:
json{
  "message": "What's your return policy?",
  "customerId": "optional-customer-id"
}
Response:
json{
  "text": "Items can be returned within 30 days... [Policy3.1]",
  "intent": "policy_question",
  "citations": ["Policy3.1"],
  "functionsCalled": [],
  "metadata": {
    "processingTime": 1234,
    "citationsValid": true
  }
}

Intelligent Assistant System
Intent Detection (7 Types)
IntentDescriptionBehaviorpolicy_questionReturns, shipping, warrantiesGrounds on knowledge base, cites sourcesorder_statusOrder tracking queriesCalls getOrderStatus() functionproduct_searchProduct searchesCalls searchProducts() functioncomplaintCustomer complaints/issuesEmpathetic, escalation-ready responsechitchatGreetings, small talkBrief, redirects to support topicsoff_topicUnrelated to e-commercePolite decline, refocusviolationAbusive/inappropriateSets boundaries, ends conversation
Function Registry
Extensible function calling system supporting:

getOrderStatus(orderId) - Retrieve real-time order information
searchProducts(query, limit) - Search product catalog
getCustomerOrders(email) - Get customer order history

Registry Methods:

register(name, schema, handler) - Register new function
getAllSchemas() - Get all function schemas for LLM
execute(name, args) - Execute function by name

Knowledge Base & Grounding

Location: /docs/ground-truth.json
15 policy documents covering returns, shipping, warranties, privacy
Simple keyword matching for policy retrieval (category-based)
Citation validation ensures responses only cite valid PolicyIDs

Assistant Identity

Name: [Your Assistant Name]
Role: Customer Support Specialist
Personality: Professional, helpful, empathetic
Never reveals: AI model, underlying technology, "I'm an AI"
Configuration: Loaded from /docs/prompts.yaml


Environment Variables
Create .env file (see .env.example):
bash# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Server
PORT=3000
NODE_ENV=production

# LLM Service (Week 3 Colab + ngrok)
LLM_ENDPOINT=https://your-ngrok-url.ngrok.io/generate
LLM_API_KEY=optional-if-secured

# CORS (Frontend URL)
FRONTEND_URL=https://your-frontend.vercel.app

Setup & Installation
Prerequisites

Node.js 18+
MongoDB Atlas account (free tier)
Week 3 LLM deployed (Colab + ngrok with /generate endpoint)

Local Development

Clone and install:

bashcd apps/api
npm install

Configure environment:

bashcp .env.example .env
# Edit .env with your MongoDB URI and LLM endpoint

Seed database:

bashnpm run seed
This populates:

25 products (variety of categories, $5-$500)
12 customers (including test user)
18 orders (diverse statuses, recent dates)


Start server:

bashnpm run dev
```

Server runs on `http://localhost:3000`

---

## Test User Credentials

**For evaluation and testing:**
```
Email: demo@example.com
Name: Alex Demo
Customer ID: [Generated by MongoDB]
This user has:

3 existing orders (various statuses)
Complete profile information
Order history accessible via API

Usage:

Look up customer: GET /api/customers?email=demo@example.com
Get orders: GET /api/orders?customerId=<returned-id>
Track order: GET /api/orders/<order-id>/stream


Testing
Run Tests
bash# All tests
npm test

# Specific test suites
npm run test:intent       # Intent detection (7 intents × 5 examples)
npm run test:identity     # Assistant identity verification
npm run test:functions    # Function calling
npm run test:api          # API endpoints
npm run test:integration  # End-to-end workflows
Integration Test Scenarios
Test 1: Complete Purchase Flow

Browse products → Create order → Subscribe to SSE → Verify live updates → Ask assistant about order

Test 2: Support Interaction Flow

Ask policy question → Verify citations → Ask about order → Express complaint → Verify responses

Test 3: Multi-Intent Conversation

Greeting → Product search → Policy question → Order check → Verify context maintained


Deployment
MongoDB Atlas Setup

Create account: https://www.mongodb.com/cloud/atlas/register
Create M0 (free) cluster
Network Access: Whitelist 0.0.0.0/0 (allow from anywhere)
Database Access: Create user with read/write permissions
Get connection string → Add to .env

Deploy to Render.com

Connect GitHub repository
Select "Web Service"
Environment: Node
Build Command: npm install
Start Command: npm start
Add environment variables from .env
Deploy

Deploy to Railway.app (Alternative)

Connect GitHub repo
Add MongoDB Atlas connection string
Railway auto-detects Node.js
Deploy


LLM Integration (Week 3 Colab)
Your Week 3 RAG system stays unchanged. Add one new endpoint:
python@app.route('/generate', methods=['POST'])
def generate():
    """Simple text completion - no RAG"""
    prompt = request.json.get('prompt')
    max_tokens = request.json.get('max_tokens', 500)
    
    response = model.generate(prompt, max_tokens=max_tokens)
    return jsonify({"text": response})
Week 5 Backend:

Does keyword grounding against ground-truth.json
Constructs full prompt with context
Sends to /generate for completion
LLM just generates text (no retrieval)


API Response Format
Success Response
json{
  "success": true,
  "data": { ... }
}
Error Response
json{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid product ID format",
    "details": { ... }
  }
}
HTTP Status Codes

200 - Success
201 - Created
400 - Bad Request (validation error)
404 - Not Found
500 - Internal Server Error


Performance & Monitoring
Metrics Tracked

API endpoint latency (per route)
SSE active connections
LLM response times by intent
Database query performance
Function call success/failure rates

Health Check
httpGET /health
Returns:
json{
  "status": "healthy",
  "database": "connected",
  "llm": "online",
  "uptime": 123456
}

Security & Best Practices

✅ Environment variables for secrets (never commit .env)
✅ Input validation on all POST/PUT requests
✅ CORS configured for frontend domain
✅ Rate limiting on API endpoints
✅ Database connection pooling
✅ Error handling without exposing internals
✅ SSE connection cleanup on disconnect


Known Limitations

No authentication: Simple email lookup for user identification (production would need JWT/sessions)
Auto-simulation: Orders auto-progress through statuses for testing (production would integrate with real shipping APIs)
Simple grounding: Keyword matching for policy retrieval (production would use vector embeddings)
Free tier limits: MongoDB 512MB, Render.com cold starts


Dependencies
json{
  "express": "^4.18.0",
  "mongodb": "^6.0.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.0",
  "axios": "^1.6.0",
  "js-yaml": "^4.1.0"
}

Contributing
This is an educational project for Week 5 coursework. No external contributions accepted.

License
MIT License - Educational Use Only

Contact & Support
Developer: [Your Name]
Email: [Your Email]
Course: Week 5 - APIs, Integrations, and LLM Features
Submission Date: October 23, 2025

Acknowledgments

MongoDB Atlas for free cloud database
Render.com / Railway.app for free hosting
Google Colab for LLM deployment
Week 3 RAG system foundation
