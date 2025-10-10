# Storefront v1 - LiveDrop

A minimal, performant e-commerce storefront built with React, TypeScript, Vite, and Tailwind CSS. Features a complete shopping journey from catalog browsing to order tracking, plus an AI-powered support assistant.

## 🚀 Features

### Core Shopping Journey

- **Product Catalog**: Grid view with search, sorting (price), and tag filtering
- **Product Details**: Individual product pages with stock indicators and related items
- **Shopping Cart**: Persistent cart with quantity controls and local storage sync
- **Checkout**: Order summary and placement flow
- **Order Tracking**: Real-time order status with carrier and ETA information

### AI Support Assistant

- **Context-Aware Help**: Answers questions using ground-truth Q&A knowledge base
- **Order Status Lookup**: Automatically detects order IDs and fetches status
- **PII Protection**: Masks sensitive information (shows last 4 characters only)
- **Citation System**: All responses include source citations [Qxx]
- **Scope-Limited**: Refuses out-of-scope queries politely

### Technical Highlights

- ⚡ **Fast**: Cold load ≤ 200 KB JS (gzipped)
- ♿ **Accessible**: Keyboard navigation, focus trapping, ARIA labels
- 🎨 **Modern Design**: Tailwind utility-first styling with responsive layouts
- 🧪 **Well-Tested**: Unit tests for all components with Vitest
- 📚 **Documented**: Storybook stories for reusable components
- 🏗️ **Atomic Design**: Components organized by complexity (atoms → templates)

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended), npm, or yarn

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd apps/storefront

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

---

## 🛠️ Available Scripts

```bash
# Development
pnpm dev          # Start Vite dev server with HMR

# Production
pnpm build        # Build for production (outputs to /dist)
pnpm preview      # Preview production build locally

# Quality
pnpm lint         # Run ESLint
pnpm test         # Run Vitest unit tests


# Storybook (if configured)
pnpm storybook    # Start Storybook dev server

```

---

## 📁 Project Structure

```
/apps/storefront/
├── public/
│   ├── logo.svg
│   └── mock-catalog.json        # 20+ product catalog
├── src/
│   ├── main.tsx                 # App entry point
│   ├── app.tsx                  # Root component with router
│   ├── index.css                # Tailwind imports
│   │
│   ├── pages/                   # Route components
│   │   ├── catalog.tsx          # Product listing with filters
│   │   ├── product.tsx          # Product detail page
│   │   ├── cart.tsx             # Shopping cart view
│   │   ├── checkout.tsx         # Checkout summary
│   │   └── order-status.tsx     # Order tracking
│   │
│   ├── components/              # Atomic Design hierarchy
│   │   ├── atoms/               # Basic building blocks
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── InfoRow.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Tag.tsx
│   │   │   └── Text.tsx
│   │   │
│   │   ├── molecules/           # Simple compositions
│   │   │   ├── CartItemCard.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── QuantityControl.tsx
│   │   │
│   │   ├── organisms/           # Complex components
│   │   │   └── SupportPanel.tsx
│   │   │
│   │   └── templates/           # Page layouts
│   │       └── MainLayout.tsx
│   │
│   ├── lib/                     # Core utilities
│   │   ├── api.ts               # Mock API & data contracts
│   │   ├── router.tsx           # React Router setup
│   │   ├── store.ts             # Zustand cart state
│   │   └── format.ts            # Currency, date, PII helpers
│   │
│   └── assistant/               # Support AI engine
│       ├── ground-truth.json    # 20 Q&A pairs
│       ├── prompt.txt           # System instructions
│       └── engine.ts            # Keyword matcher + order lookup
│
├── component-prompts.md         # AI scaffolding log
├── README.md                    # This file
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## 🎯 Key Components

### Atoms (Basic UI Elements)

- **Badge**: Tag-style labels for products
- **Button**: Primary/Secondary/Danger variants
- **Card**: User/Support message containers
- **Input**: Text input with consistent styling
- **InfoRow**: Label-value display pairs
- **Tag**: Minimal inline tags
- **Text**: Flexible text wrapper

### Molecules (Composite Components)

- **ProductCard**: Displays product with image, price, stock, CTA
- **CartItemCard**: Cart item with quantity controls and remove button
- **QuantityControl**: +/- buttons for quantity adjustment
- **ChatInput**: Input field + Send button for support panel

### Organisms (Complex Features)

- **SupportPanel**: Slide-over panel with chat interface, Q&A matching, and order lookup

### Templates (Page Layouts)

- **MainLayout**: Header, footer, main content area, and support panel

---

## 🤖 Support Assistant

### How It Works

1. **Keyword Matching**: Scores user queries against 20 ground-truth Q&As
2. **Order Detection**: Regex pattern `[A-Z0-9]{10,}` triggers status lookup
3. **Threshold Logic**: Requires ≥2 keyword matches for confident answers
4. **Fallback Response**: Politely refuses if confidence is low

### Ground Truth Categories

- Seller Accounts
- Returns & Orders
- Promotions
- Payment & Security
- Search & Filters
- Inventory Management
- Reviews & Ratings
- Customer Support
- Privacy & Compliance

### PII Protection

- Order IDs are masked (e.g., `******1234`)
- Full IDs never displayed to users
- Implemented via `maskId()` helper in `lib/format.ts`

### Testing Support

```typescript
// Known policy question
Q: "What are the return policies?"
A: Returns within 30 days... [Q02]

// Out of scope
Q: "What's the weather?"
A: "Sorry, I don't have information about that."

// Order status
Q: "Check order ABC1234567"
A: "Order ***4567 is Shipped with FastShip, ETA: 2 days [Q00]"
```

---

## 🧪 Testing

All components include:

- **Unit Tests** (`.test.tsx`): Props, user interactions, accessibility
- **Storybook Stories** (`.stories.tsx`): Visual documentation and isolated testing

### Running Tests

```bash
pnpm test                # Run all tests
pnpm test CartItemCard   # Run specific test
pnpm test --coverage     # Generate coverage report
```

### Test Stack

- **Vitest**: Fast unit test runner
- **@testing-library/react**: User-centric component testing
- **@testing-library/user-event**: Realistic user interactions

---

## 🎨 Styling

### Tailwind CSS

- Utility-first approach
- Responsive breakpoints (sm, md, lg)
- Custom color palette (blue primary, gray neutrals)
- Consistent spacing scale

### Design Tokens

```css
/* Primary Actions */
bg-blue-600, hover:bg-blue-700

/* Neutral Backgrounds */
bg-gray-50, bg-gray-100, bg-white

/* Text Hierarchy */
text-3xl font-bold (h1)
text-lg font-semibold (h2)
text-gray-600 (secondary text)
```

---

## 📊 Performance

### Bundle Size

- **Target**: ≤ 200 KB JS (gzipped)
- **Lazy Loading**: Images loaded on demand
- **Code Splitting**: Route-based chunks

### Optimizations

- Vite's built-in tree-shaking
- React 19 performance improvements
- Zustand's minimal overhead (≈1KB)
- No heavy UI libraries

---

## 🔒 Security

### Data Handling

- No authentication (demo scope)
- localStorage for cart only (no sensitive data)
- Order IDs are client-generated (not production-ready)
- PII masking in all UI displays

### API Contracts

```typescript
// Products
Product { id, title, price, image, tags, stockQty }

// Cart
CartItem { id, title, price, qty }

// Orders
OrderStatus { orderId, status, carrier?, eta? }

// Q&A
GroundTruth { qid, category, question, answer }
```

---

## 🚀 Deployment

### Build

```bash
pnpm build
```

Output: `/dist` folder (static files)

### Deploy Targets

- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop or CLI
- **AWS S3 + CloudFront**: Static hosting
- **GitHub Pages**: Via Actions workflow

### Environment Variables

```bash
# Optional: For future OpenAI integration
VITE_OPENAI_API_KEY=sk-...
```

**Note**: Create `.env.example` if using environment variables.

---

## 📝 Assignment Compliance

### Deliverables ✅

- [x] Catalog with search, sort, filter
- [x] Product detail page with related items
- [x] Persistent cart with localStorage
- [x] Checkout stub with order creation
- [x] Order status tracking
- [x] Ask Support panel (keyword-based, order lookup)
- [x] Atomic Design structure
- [x] Unit tests for all components
- [x] Storybook documentation
- [x] Performance targets met
- [x] Accessibility features (keyboard nav, ARIA labels)
- [x] PII protection (last 4 digits only)

### File Structure ✅

All required paths created as specified in assignment.

---

## 🤝 Contributing

### Adding Components

1. Create component in appropriate atomic folder
2. Add `.test.tsx` for unit tests
3. Add `.stories.tsx` for Storybook
4. Export from parent folder if needed

### Adding Support Q&As

Edit `/src/assistant/ground-truth.json`:

```json
{
  "qid": "Q21",
  "category": "New Category",
  "question": "User question?",
  "answer": "Your answer here."
}
```

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vitest](https://vitest.dev)
- [React Router](https://reactrouter.com)

---

## 📄 License

MIT (for educational purposes)

---

## 👨‍💻 Author

Built as part of **Week 4 - Frontend at Lightspeed** assignment.

**Deadline**: October 12, 2025 at 6 PM
