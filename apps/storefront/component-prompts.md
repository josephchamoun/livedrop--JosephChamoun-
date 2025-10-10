# Component Prompts Log

This document tracks AI prompts used to scaffold components, tests, and stories for the Storefront v1 project.

---

## Atoms

### Badge.tsx

**Prompt**: "Create a React Badge component that displays inline text with a gradient blue background, rounded corners, border, and shadow. Use Tailwind CSS classes. Include TypeScript props for children."

**Generated**: Component, test file, and Storybook story with multiple variants (New, Sale, Limited).

---

### Button.tsx

**Prompt**: "Build a flexible Button component with variants (primary, secondary, danger), proper TypeScript types extending HTMLButtonElement, disabled state handling, and active scale animation using Tailwind. Include gradient styles for primary."

**Generated**: Component with 3 variants, comprehensive test coverage including click handlers and disabled state, 4 Storybook stories.

---

### Card.tsx

**Prompt**: "Create a Card component for chat messages with two variants: 'user' (gradient blue background) and 'support' (white with border). Use Tailwind CSS. Should accept children prop."

**Generated**: Component, tests for both variants, Storybook stories demonstrating both use cases.

---

### Input.tsx

**Prompt**: "Build a simple Input component that extends React.InputHTMLAttributes and applies consistent Tailwind border/padding styling. Should be flexible for any input type."

**Generated**: Minimal, reusable input component with tests for placeholder, typing, and disabled states.

---

### InfoRow.tsx

**Prompt**: "Create an InfoRow component that displays a label-value pair. Label should be bold, value should support optional custom className. Use TypeScript for props."

**Generated**: Simple component with tests for label rendering and custom styling, plus Storybook stories.

---

### Tag.tsx

**Prompt**: "Build a Tag component for small inline labels (like product categories). Use gray background, rounded-full, small text, and allow optional className override. Tailwind CSS only."

**Generated**: Lightweight component with tests and stories showing default and custom styling.

---

### Text.tsx

**Prompt**: "Create a Text wrapper component that extends HTMLDivElement attributes, accepts children and className, useful for consistent text styling throughout the app."

**Generated**: Flexible text container with tests for children rendering and className application.

---

## Molecules

### ProductCard.tsx

**Prompt**: "Build a ProductCard component that displays product image, title, price (formatted with currency helper), stock quantity, tags (using Badge), and 'Add to Cart' button. Include hover effects and transform animation. Should link to product detail page. Use TypeScript for Product interface."

**Generated**: Feature-rich card with tests for rendering, click handlers, and routing. Storybook story with sample product data.

---

### CartItemCard.tsx

**Prompt**: "Create a CartItemCard that shows cart item details, integrates QuantityControl component for +/- buttons, includes Remove button, and displays formatted price. Should handle updateQty and removeItem callbacks."

**Generated**: Complex molecule with quantity controls, tests for all interactions, Storybook story with mocked handlers.

---

### QuantityControl.tsx

**Prompt**: "Build a QuantityControl component with - and + buttons (secondary variant) and centered quantity display. Accept onIncrease, onDecrease callbacks and qty prop."

**Generated**: Simple control with tests for both button clicks and quantity display, plus interactive story.

---

### ChatInput.tsx

**Prompt**: "Create a ChatInput molecule that combines Input and Button atoms in a flex layout. Should handle form submission with preventDefault, controlled input value, and onChange callback."

**Generated**: Form-based input with tests for typing and submission, interactive Storybook story with useState hook.

---

## Organisms

### SupportPanel.tsx

**Prompt**: "Build a SupportPanel organism that:

- Toggles open/close with a fixed floating button
- Shows full-height slide-over panel from right side
- Displays chat history with user/support Card variants
- Integrates ChatInput molecule
- Calls findAnswer() from assistant/engine.ts
- Shows citations [Qxx] for all responses
- Includes close button and focus trapping

Use useState for panel state and messages array."

**Generated**: Complex organism with full chat interface, keyboard accessibility, and assistant integration. Includes manual testing checklist.

---

## Templates

### MainLayout.tsx

**Prompt**: "Create a MainLayout template with:

- Header (white background, LiveDrop logo, shadow)
- Main content area (flex-1, container, padding)
- Footer (gray background, copyright text)
- SupportPanel always rendered
- Accepts children prop for page content

Use semantic HTML and Tailwind for styling."

**Generated**: Full page layout wrapper used across all routes, consistent header/footer styling.

---

## Pages

### catalog.tsx

**Prompt**: "Build a Catalog page that:

- Fetches products from listProducts() API
- Shows loading/error states
- Implements search by title and tags
- Adds sort by price (asc/desc) dropdown
- Adds tag filter dropdown (dynamic from products)
- Displays products in responsive grid using ProductCard
- Integrates with cart store (addItem)
- Includes link to cart page
- Uses MainLayout template

Use useMemo for filtered/sorted products to optimize performance."

**Generated**: Full-featured catalog with all filtering logic, loading states, and responsive grid. Tests cover search, sort, and filter interactions.

---

### product.tsx

**Prompt**: "Create a Product detail page that:

- Gets product ID from URL params
- Fetches product with getProduct() API
- Shows product image, title, formatted price, stock indicator
- Displays tags using Tag component
- Shows 'Add to Cart' button (disabled if out of stock)
- Calculates 3 related products by shared tags
- Renders related items as clickable cards
- Includes back-to-catalog link
- Uses MainLayout

Handle loading and error states properly."

**Generated**: Detail page with related products algorithm, stock handling, and comprehensive error boundaries.

---

### cart.tsx

**Prompt**: "Build a Cart page that:

- Reads items from cart store
- Shows empty state with back link if no items
- Maps items to CartItemCard components
- Calculates and displays total with formatCurrency
- Includes 'Clear Cart' and 'Checkout' buttons
- Uses MainLayout template

Pass updateQty and removeItem from store to each CartItemCard."

**Generated**: Full cart view with empty state, total calculation, and clear/checkout actions.

---

### checkout.tsx

**Prompt**: "Create a Checkout page that:

- Reads cart items from store
- Shows empty cart message if needed
- Displays order summary (item × qty = subtotal)
- Shows grand total with formatCurrency
- 'Place Order' button calls placeOrder() API
- Clears cart after order placement
- Navigates to /order/:id with generated order ID
- Uses MainLayout

Should be a summary-only view, no payment form."

**Generated**: Minimal checkout stub meeting assignment requirements, proper navigation flow.

---

### order-status.tsx

**Prompt**: "Build an Order Status page that:

- Gets order ID from URL params
- Calls getOrderStatus() API
- Displays order ID (masked with maskId), status, carrier, ETA
- Uses InfoRow components for data display
- Color-codes status (green for Delivered, blue for Shipped)
- Formats ETA with formatDate if available
- Includes back-to-catalog link
- Uses MainLayout

Handle loading state while fetching."

**Generated**: Order tracking page with PII masking and conditional rendering based on status.

---

## Lib Utilities

### api.ts

**Prompt**: "Create API helper file with:

- Product and CartItem TypeScript interfaces
- listProducts(): fetch /mock-catalog.json
- getProduct(id): find product by ID
- placeOrder(cart): generate random order ID, save to localStorage
- getOrderStatus(id): return mock status (Placed/Packed/Shipped/Delivered), carrier, and ETA

Use async/await for fetch operations."

**Generated**: Complete mock API layer with proper TypeScript types and error handling.

---

### store.ts

**Prompt**: "Build a Zustand cart store with:

- items: CartItem[]
- addItem: merge quantity if exists, else append
- removeItem: filter by ID
- updateQty: update or remove if qty ≤ 0
- clearCart: reset to empty array
- Persist to localStorage using zustand/middleware

Use proper TypeScript types and createJSONStorage."

**Generated**: Persistent cart state with all CRUD operations and localStorage sync.

---

### format.ts

**Prompt**: "Create formatting utilities:

- formatCurrency(amount, currency='USD'): use Intl.NumberFormat
- maskId(id): show last 4 chars, pad rest with asterisks
- formatDate(date): format to 'MMM DD, YYYY' style

All functions should handle edge cases and accept flexible inputs."

**Generated**: Three helper functions used across components for consistent formatting.

---

### router.tsx

**Prompt**: "Set up React Router with BrowserRouter and Routes for:

- / → Catalog
- /p/:id → ProductPage
- /cart → CartPage
- /checkout → CheckoutPage
- /order/:id → OrderStatusPage

Export as default AppRouter component."

**Generated**: Clean routing setup with param-based routes for dynamic pages.

---

## Assistant Engine

### engine.ts

**Prompt**: "Build support assistant engine that:

- Detects order ID regex [A-Z0-9]{10,} and calls getOrderStatus
- Masks order ID to last 4 digits in response
- Tokenizes query and scores against ground-truth.json questions
- Returns best match if score ≥ 2 keywords
- Returns 'Sorry, I don't have information' if low confidence
- Always includes citation [Qxx] in response text
- Returns Answer interface with qid and text

Use simple keyword overlap scoring, no ML dependencies."

**Generated**: Keyword-based matcher with order lookup, proper scoring threshold, and citation system.

---

### ground-truth.json

**Prompt**: "Create 20 Q&A pairs covering:

- Seller accounts
- Returns & orders
- Promotions
- Payment & security
- Search & filtering
- Inventory management
- Reviews
- Customer support
- Privacy
- Account management
- Mobile app
- APIs
- Order tracking
- Discounts
- Product quality

Each entry should have qid (Q01-Q20), category, question, and answer fields."

**Generated**: Comprehensive knowledge base with diverse topics, properly structured JSON.

---

### prompt.txt

**Prompt**: "Write system instructions for the support assistant:

- Identity as LiveDrop Support Assistant
- Only use ground-truth.json answers
- Call getOrderStatus for order IDs
- Never invent answers
- Refuse politely if unsure
- Always cite with [Qxx]

Keep it concise and rule-based."

**Generated**: Clear guidelines for assistant behavior (currently for reference, not used in runtime).

---

## Testing Approach

### Unit Tests

**Prompt Pattern**: "Write Vitest unit tests for [ComponentName] that cover:

- Rendering with required props
- User interactions (clicks, typing)
- Prop callbacks are called correctly
- Conditional rendering based on props
- Accessibility (roles, labels)
- Edge cases (empty states, disabled)"

**Applied to**: All atoms, molecules, and organisms. Generated comprehensive test suites with high coverage.

---

### Storybook Stories

**Prompt Pattern**: "Create Storybook stories for [ComponentName] with:

- Default story showing common use case
- Variants for each prop combination
- Interactive args for testing
- Decorators if needed (e.g., MemoryRouter for Link components)

Use Meta and StoryObj types from @storybook/react."

**Applied to**: All reusable components. Generated visual documentation and isolated testing environments.

---

## Build Configuration

### Vite Config

**Prompt**: "Set up basic Vite config with @vitejs/plugin-react for Fast Refresh. No custom aliases or special config needed."

**Generated**: Minimal vite.config.ts for optimal performance.

---

### Tailwind Config

**Prompt**: "Configure Tailwind CSS v3 with:

- Content paths for src/\*_/_.{ts,tsx}
- Default theme (no customization)
- PostCSS setup for @tailwindcss/postcss

Keep it minimal and standard."

**Generated**: Basic Tailwind configuration meeting project needs.

---

## Notes on AI Usage

### What Worked Well

✅ **Atoms & Molecules**: AI excelled at generating simple, self-contained components with consistent patterns
✅ **Tests**: Boilerplate test structure was quick to generate, required minimal tweaking
✅ **TypeScript Types**: Props interfaces were correctly inferred and applied
✅ **Storybook Stories**: Template-based story generation saved significant time
✅ **Tailwind Styling**: AI understood utility-first patterns and created responsive designs

### What Needed Manual Refinement

⚠️ **Complex State Logic**: Zustand store setup required manual review of persist middleware
⚠️ **Routing Integration**: ProductCard needed MemoryRouter decorator in Storybook
⚠️ **Assistant Engine**: Keyword scoring algorithm was manually designed, not AI-generated
⚠️ **Performance**: Import optimizations and lazy loading were manually added
⚠️ **Accessibility**: Focus trapping in SupportPanel required manual ARIA attribute setup

### Prompt Engineering Tips

1. **Be specific about dependencies**: Mention Tailwind, TypeScript, Vitest explicitly
2. **Request test coverage**: Include "with tests" in prompts to get test files
3. **Ask for variants**: Enumerate expected use cases (primary/secondary/danger)
4. **Specify structure**: Mention Atomic Design level to maintain organization
5. **Include examples**: Show sample data structures for complex props

---

## Time Savings Estimate

| Task                      | Manual Time  | AI-Assisted Time | Savings        |
| ------------------------- | ------------ | ---------------- | -------------- |
| Component Creation        | ~30 min each | ~5 min each      | 83%            |
| Test Writing              | ~20 min each | ~3 min each      | 85%            |
| Storybook Stories         | ~15 min each | ~2 min each      | 87%            |
| TypeScript Types          | ~10 min each | ~1 min each      | 90%            |
| **Total (30 components)** | ~37.5 hours  | ~5.5 hours       | **85% faster** |

_Note: Times exclude debugging, refactoring, and integration work._

---

## Lessons Learned

1. **Start with atoms**: Build bottom-up to ensure consistent base components
2. **Test early**: Generate tests alongside components to catch issues faster
3. **Iterate prompts**: First generation is 70% there, refine for remaining 30%
4. **Maintain patterns**: AI follows your existing patterns if you show examples
5. **Review AI output**: Never commit without testing—AI can hallucinate imports or logic

---

**Total Components Generated with AI Assistance**: 30+
**Total Test Files**: 30+
**Total Storybook Stories**: 20+
**Total Lines of Code**: ~3,500 (excluding node_modules)
