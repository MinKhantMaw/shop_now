# Enterprise React eCommerce Storefront Architecture (Laravel API Backend)

This document defines a production-ready frontend architecture for a high-scale React storefront that consumes a Laravel REST API, supports guest + authenticated customer journeys, and includes secure checkout/payment behavior.

---

## 1) Project Architecture

### 1.1 Recommended stack
- **React 18 + TypeScript** (strict mode)
- **Vite** for build tooling
- **React Router v6.4+ data routers** for route-level data loading
- **TanStack Query** for server-state caching and request orchestration
- **Zustand** (or Redux Toolkit if team preference) for client-state slices (auth/cart/ui)
- **React Hook Form + Zod** for form validation
- **Tailwind + Design Tokens** for mobile-first UI system
- **Helmet Async** for metadata in SPA mode; optional SSR with Next.js/Remix for SEO-heavy catalogs

### 1.2 Folder structure
```txt
src/
  app/
    providers/
      QueryProvider.tsx
      RouterProvider.tsx
      AuthProvider.tsx
      ThemeProvider.tsx
    router/
      index.tsx
      routes/
        publicRoutes.tsx
        protectedRoutes.tsx
  api/
    client.ts                 # axios/fetch wrapper + interceptors
    auth.api.ts
    products.api.ts
    cart.api.ts
    checkout.api.ts
    orders.api.ts
    payments.api.ts
  features/
    auth/
      pages/
      components/
      hooks/
      store/
      schemas/
    products/
      pages/
      components/
      hooks/
      services/
    cart/
      components/
      hooks/
      store/
      services/
    checkout/
      pages/
      components/
      hooks/
      schemas/
    orders/
      pages/
      components/
      hooks/
  components/
    layout/
      MainLayout.tsx
      CheckoutLayout.tsx
      AccountLayout.tsx
    seo/
      SeoHead.tsx
      JsonLd.tsx
    common/
      Button.tsx
      Input.tsx
      Pagination.tsx
      Skeleton.tsx
  hooks/
    useDebounce.ts
    useAuthGuard.ts
  lib/
    constants.ts
    env.ts
    formatters.ts
    errors.ts
  types/
    api.ts
    domain.ts
  assets/
```

### 1.3 Routing strategy
- **Public routes**: `/`, `/products`, `/products/:slug`, `/cart`, `/checkout` (guest allowed until payment step), `/login`, `/register`.
- **Protected routes**: `/account`, `/account/orders`, `/account/orders/:id`, `/account/profile`.
- **Data routers**:
  - route loaders prefetch critical data (`product`, `categories`, `order detail`)
  - route actions for mutation-oriented submissions where helpful
- **Guarding rules**:
  - checkout payment step requires authenticated customer
  - account routes require `auth.isAuthenticated === true`
  - redirect to intended URL after login

### 1.4 Layout system
- `MainLayout`: header, mega nav, search, footer, global cart drawer.
- `CheckoutLayout`: minimal distractions, progress stepper.
- `AccountLayout`: side navigation for profile/orders.
- responsive breakpoints mobile-first (`sm/md/lg/xl`) with adaptive nav/cart behavior.

---

## 2) Authentication Flow

### 2.1 Registration (customer role only)
- `POST /api/v1/auth/register`
- request body includes email, password, first_name, last_name, phone.
- backend enforces role assignment = `customer` regardless of payload.
- after success:
  1. return access token + refresh token + customer profile
  2. initialize auth store
  3. trigger guest cart merge

### 2.2 Login
- `POST /api/v1/auth/login`
- response: `access_token`, `refresh_token`, `expires_in`, user info.
- flow:
  - save tokens via secure strategy (below)
  - set auth state
  - call `POST /cart/merge` if guest cart exists
  - redirect to intended route or account/dashboard

### 2.3 Token storage
**Recommended hybrid approach**:
- Access token: in-memory store (fast, reduced persistent XSS impact).
- Refresh token: `HttpOnly`, `Secure`, `SameSite=Lax/Strict` cookie from Laravel.
- If backend requires bearer refresh token, encrypt-at-rest in secure storage and rotate aggressively.

### 2.4 Refresh token flow
- Interceptor on `401` + token expired code:
  1. queue pending requests
  2. call `POST /api/v1/auth/refresh` (cookie-based)
  3. replace access token in memory
  4. replay queued requests
- hard-fail path:
  - if refresh fails -> clear stores -> redirect `/login?reason=session_expired`

### 2.5 Logout
- `POST /api/v1/auth/logout`
- invalidate refresh token/session server-side
- clear client auth/cart account-scoped cache
- optionally keep guest cart snapshot if user logs out intentionally

---

## 3) Product Listing

### 3.1 Pagination
- use cursor pagination at scale (`?cursor=...&limit=24`) to avoid deep offset costs.
- fallback offset for SEO pages if required.
- infinite-scroll on mobile optional; numbered pagination for crawlability.

### 3.2 Filtering
- filter facets: category, brand, price range, attributes (size/color), rating, availability.
- route-driven filter state in URL query params:
  - `/products?category=shoes&color=black&price_min=50&price_max=200`
- parse query params on load, map to API payload.

### 3.3 Sorting
- supported sorts: relevance, newest, price_asc, price_desc, top_rated, best_selling.
- include `sort` in query key for cache isolation.

### 3.4 Search logic
- debounced input (250–400ms), cancel stale requests.
- backend-powered search endpoint with typo tolerance/synonyms where available.
- keep search term in URL for shareable result pages.

### 3.5 Caching strategy
- TanStack Query key pattern:
  - `['products', { filters, sort, cursor, search }]`
- stale-while-revalidate behavior:
  - `staleTime`: 30–120s for listing pages
  - `gcTime`: longer for common categories
- prefetch likely next page/cursor in background.

---

## 4) Product Detail Page (PDP)

### 4.1 Image gallery
- primary image + thumbnail carousel + pinch-zoom on mobile.
- lazy-load non-primary images; use responsive `srcset`/`sizes`.

### 4.2 Reviews
- `GET /products/:id/reviews?sort=recent&page=1`
- aggregate rating summary + paginated reviews.
- authenticated customers can post review after verified purchase check.

### 4.3 Related products logic
- API-driven recommendation slots:
  - same category
  - complementary products
  - “customers also bought”
- fallback to popular-in-category if recommendation service times out.

---

## 5) Cart Logic

### 5.1 Guest cart (localStorage)
- key: `guest_cart_v1`
- shape: `{ items: [{ sku_id, qty, unit_price_snapshot }], updated_at }`
- validate stock/pricing server-side on every checkout/cart sync.

### 5.2 Logged-in cart (API)
- canonical cart persisted server-side:
  - `GET /cart`
  - `POST /cart/items`
  - `PATCH /cart/items/:itemId`
  - `DELETE /cart/items/:itemId`

### 5.3 Cart merge after login
- if guest cart exists:
  1. call `POST /cart/merge` with guest items
  2. backend resolves duplicates by SKU and stock constraints
  3. frontend replaces local cart with server response
  4. delete `guest_cart_v1`
- merge conflict handling: show non-blocking toast with adjusted quantities.

---

## 6) Checkout Flow

### 6.1 Address form
- collect shipping + billing (toggle “same as shipping”).
- validate with Zod: postal code, phone, country/state rules.
- optional saved-address selector for logged users.

### 6.2 Order summary
- show line items, shipping, tax, discounts, final total.
- all computed totals displayed as **estimated** until server lock.

### 6.3 Server-side total validation
- `POST /checkout/validate`
- backend recalculates authoritative totals from live catalog/pricing/tax rules.
- response includes normalized line items and payable amount.

### 6.4 Coupon logic
- `POST /coupons/apply` with code + cart context.
- backend returns eligibility, discount amount, invalid reason.
- maintain applied coupon in checkout state; invalidate on cart mutation.

### 6.5 Payment intent request
- after validation:
  - `POST /payments/intent` with order draft id + final amount.
- returns `client_secret` (Stripe-like provider), payment_intent_id.

---

## 7) Payment Handling

### 7.1 Confirm payment
- client renders provider card element.
- call `confirmCardPayment(client_secret, paymentMethodData)`.
- if SCA/3DS required, provider handles challenge modal.

### 7.2 Loading/error states
- states: `idle -> validating -> creating_intent -> confirming -> success|failed`.
- disable submit during async operations.
- surface card errors inline; keep order draft for retry.

### 7.3 Success redirect
- on success:
  - `POST /checkout/complete` with payment intent id
  - clear cart
  - redirect `/order/success/:orderNumber`
  - emit analytics events (purchase, revenue, items)

---

## 8) Order History

### 8.1 Fetch user orders
- `GET /account/orders?status=all&page=1`
- list with pagination and quick filters.

### 8.2 Display order status
- normalized statuses: pending, paid, processing, shipped, delivered, cancelled, refunded.
- color-coded badges + timeline.

### 8.3 View order details
- `GET /account/orders/:orderId`
- detail: items, shipment tracking, payment summary, invoice link, reorder action.

---

## 9) Global State Management

### 9.1 Auth state
- store: `user`, `isAuthenticated`, `accessToken`, `authStatus`.
- source of truth for UI guard/conditional rendering.

### 9.2 Cart state
- store: `items`, `totals`, `coupon`, `cartVersion`, `syncStatus`.
- optimistic updates with rollback on API failure.

### 9.3 Product state
- avoid duplicating server state globally.
- use TanStack Query cache + derived selectors for UI.

---

## 10) Performance Optimization

- **Code splitting**: route-level lazy imports (`React.lazy`, dynamic imports).
- **Lazy loading**: heavy widgets (reviews carousel, recommendations).
- **Image optimization**:
  - next-gen formats (WebP/AVIF)
  - responsive variants from CDN/image service
  - blur placeholders
- **Caching**:
  - CDN cache static assets aggressively
  - API cache headers (`ETag`, `Cache-Control`) for catalog endpoints
  - query cache tuned per endpoint volatility

---

## 11) SEO Strategy

### 11.1 Meta tags
- dynamic title/description/canonical per category/PDP.
- OG/Twitter tags for social share.

### 11.2 Structured data
- JSON-LD schemas:
  - `Product` on PDP (price, availability, rating)
  - `BreadcrumbList`
  - `Organization`

### 11.3 Optional SSR approach
- for enterprise SEO, prefer **Next.js/Remix** hybrid rendering:
  - SSR/ISR for category + PDP
  - client hydration for interactive cart/account
- if SPA-only, deploy prerendering for critical marketing/category routes.

---

## 12) Security

- enforce HTTPS + HSTS.
- prefer HttpOnly refresh token cookie over localStorage.
- sanitize/render user-generated content safely in reviews.
- do not expose provider secret keys client-side.
- generic error messages for auth/payment failures to avoid enumeration.
- CSRF protections for cookie-auth refresh endpoints.
- strict CSP and dependency scanning in CI.

---

## 13) Deployment

- `npm run build` outputs optimized assets.
- deploy to edge/CDN (CloudFront/Fastly/Cloudflare) with immutable hashed files.
- environment config:
  - `VITE_API_BASE_URL`
  - `VITE_PAYMENT_PUBLIC_KEY`
  - `VITE_SENTRY_DSN`
- release strategy:
  - blue/green or canary
  - feature flags for risky checkout/payment changes
  - observability dashboards (web vitals + checkout funnel)

---

## End-to-End Step-by-Step Workflow

1. **Register**: user submits signup form → Laravel creates customer account → returns auth payload.
2. **Login**: user authenticates → access token in memory, refresh token in secure cookie.
3. **Browse**: user hits listing routes with URL-based filters/sort/search → query cache stores result pages.
4. **PDP**: user views product, images/reviews/related load in parallel.
5. **Add to cart**:
   - guest: localStorage cart update.
   - logged-in: API mutation + optimistic UI.
6. **Cart merge**: guest logs in during checkout → merge endpoint consolidates carts.
7. **Checkout**: enter address, apply coupon, server validates authoritative totals.
8. **Payment**: create intent, confirm card, handle SCA challenge if required.
9. **Order completion**: backend finalizes order after payment confirmation.
10. **Order history**: customer views order list/detail under account routes.

---

## Sequence Diagram (Text)

```txt
Customer -> Frontend: Register/Login request
Frontend -> Laravel API: POST /auth/register or /auth/login
Laravel API --> Frontend: access token + refresh cookie + profile

Customer -> Frontend: Browse catalog with filters
Frontend -> Laravel API: GET /products?...query
Laravel API --> Frontend: paginated products

Customer -> Frontend: Add item to cart
alt Guest
  Frontend -> localStorage: persist guest_cart_v1
else Authenticated
  Frontend -> Laravel API: POST /cart/items
  Laravel API --> Frontend: updated cart
end

Customer -> Frontend: Proceed to checkout
Frontend -> Laravel API: POST /checkout/validate
Laravel API --> Frontend: authoritative totals + order draft
Frontend -> Laravel API: POST /payments/intent
Laravel API --> Frontend: client_secret
Frontend -> Payment Provider SDK: confirm payment
Payment Provider SDK --> Frontend: payment_result
Frontend -> Laravel API: POST /checkout/complete
Laravel API --> Frontend: order confirmation
Frontend -> Customer: redirect /order/success/:orderNumber

Customer -> Frontend: Open order history
Frontend -> Laravel API: GET /account/orders
Laravel API --> Frontend: orders list/details
```

---

## API Request Examples

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "first_name": "Ava",
  "last_name": "Johnson",
  "email": "ava@example.com",
  "password": "StrongPass!234",
  "phone": "+12025550111"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "ava@example.com",
  "password": "StrongPass!234"
}
```

### Product listing with filters/sort
```http
GET /api/v1/products?category=shoes&price_min=50&price_max=200&sort=price_asc&cursor=eyJpZCI6...
Authorization: Bearer <access_token_if_available>
```

### Merge cart
```http
POST /api/v1/cart/merge
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "items": [
    { "sku_id": "SKU-RED-42", "qty": 2 },
    { "sku_id": "SKU-BLK-41", "qty": 1 }
  ]
}
```

### Validate checkout + create payment intent
```http
POST /api/v1/checkout/validate
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "shipping_address_id": "addr_123",
  "billing_same_as_shipping": true,
  "coupon_code": "SPRING20"
}
```

```http
POST /api/v1/payments/intent
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "order_draft_id": "od_789",
  "payment_method_type": "card"
}
```

### Orders
```http
GET /api/v1/account/orders?status=all&page=1
Authorization: Bearer <access_token>
```

---

## State Transition Explanation

### Auth state machine
```txt
unauthenticated
  -> registering
  -> authenticated
  -> refreshing_token
  -> authenticated
  -> logout_pending
  -> unauthenticated
```

### Cart state machine
```txt
idle
  -> loading_cart
  -> ready
  -> mutating (add/remove/update)
  -> sync_success | sync_failed(rollback)
```

### Checkout state machine
```txt
cart_ready
  -> address_validating
  -> totals_validated
  -> payment_intent_created
  -> payment_confirming
  -> order_completed | payment_failed(retry_allowed)
```

These state machines should be encoded in predictable store slices and reflected in UI controls (button disabled states, skeletons, error banners, retries).
