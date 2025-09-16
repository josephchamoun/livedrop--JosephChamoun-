# livedrop--JosephChamoun-

# LiveDrop System Design – Joseph Chamoun

This repository contains the system design assignment for **LiveDrop**.  
It includes the high-level architecture diagram, data model sketches, API contracts, and caching strategy.

---

## 📌 Repository Contents
- High-level architecture & data model graph.
- **APIs.md** → Public & internal API endpoints with request/response bodies and error formats.
- **Caching.md** → Cache invalidation strategy and trade-offs.

---

## 🔗 Graph Link
https://excalidraw.com/#json=rD-zcC3959_rcjK3wGHwP,Kk283wn4Tvg2SvQgphH1qg

---

## 🏗️ System Design Approach

### 1. **Architecture**
- **API Gateway**: Single public entry point for mobile/web clients.  
- **Load Balancer**: Distributes requests across services.  
- **Services**: Independent microservices for Users, Products, Drops, Orders, Notifications.  
- **Database**: SQL (relational data like users, orders) + NoSQL (cached/session data, search).  
- **Cache (Redis)**: Improves read performance for products, drops, and search results.  
- **Event Streaming (Kafka)**: Handles asynchronous updates (e.g., product updates, stock changes, notifications).  
- **CDN**: Used to distribute static content (images, media).

### 2. **Data Model**
- **Users Table**: Authentication, profiles, roles.  
- **Products Table**: Product catalog.  
- **Drops Table**: Time-sensitive product releases.  
- **Orders Table**: Tracks purchases and stock changes.  
- **Notifications Table**: User alerts and updates.

### 3. **API Contract**
- **Public APIs**: `/users`, `/products`, `/drops`, `/orders`, `/notifications`.  
- **Internal APIs**: Used between services for logging, inventory updates, and cache invalidation.  
- **Consistent error handling** with `code`, `message`, `details`.

### 4. **Caching Strategy**
- **Write-through with TTL** to ensure freshness.  
- **Event-driven invalidation via Kafka** (`product.updated`, `drop.started`, `order.placed`).  
- **Manual invalidation API** for bulk updates.  
- **Strong consistency** for inventory, **eventual consistency** for non-critical data.

---

## ✅ Key Trade-offs
- **Microservices vs Monolith**: Microservices chosen for scalability & flexibility.  
- **SQL + NoSQL**: Relational data consistency + flexible caching/search performance.  
- **Caching strategy** balances speed with consistency, especially during high-demand drops.  
- **Event-driven design** ensures decoupled, scalable communication.

---

👨‍💻 **Author**: Joseph Chamoun
