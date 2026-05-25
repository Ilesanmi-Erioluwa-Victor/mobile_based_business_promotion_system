# BizPromo — System Design

## Architecture

BizPromo is organized into a React frontend, Express backend and MongoDB database. The frontend communicates with the backend through REST endpoints. The backend handles authentication, authorization, file uploads, payment verification and database persistence.

## Data Flow

### a) Registration and Login Flow

1. User submits registration or login form.
2. React sends credentials to `/api/auth`.
3. Express validates input and hashes or compares passwords with bcrypt.
4. JWT token and user profile are returned.
5. Frontend stores token and user in localStorage.

### b) Business Discovery Flow

1. Customer searches by keyword, category or state.
2. Frontend calls `/api/search`.
3. Backend searches only businesses where `isListed: true`.
4. Results are returned as paginated business cards.

### c) Inquiry Flow

1. Customer opens a business profile.
2. Customer submits inquiry form.
3. Backend stores the inquiry with sender and business references.
4. Business owner views inquiry from the dashboard.

### d) Business Owner Pays Listing Fee Flow

1. Owner submits business profile, saved with `isListed: false`.
2. Dashboard shows "Pay to Publish" banner.
3. Owner clicks `PaystackButton`, frontend calls `POST /api/payments/initialize`.
4. Backend calls Paystack API, saves pending `Payment` doc, returns reference and popup config.
5. Paystack inline popup opens in browser.
6. Owner completes payment on Paystack popup.
7. Paystack calls `onSuccess` callback with transaction reference.
8. Frontend calls `GET /api/payments/verify/:reference`.
9. Backend verifies with Paystack API, then sets `Business.isListed = true` and `Payment.status = 'success'`.
10. Dashboard updates to show "Business is live".

### e) Business Owner Boosts a Promotion Flow

1. Owner opens Promotions page and selects a non-boosted promotion.
2. Frontend calls `POST /api/payments/initialize` with `type: 'boost'`, `promotionId` and amount ₦500.
3. Backend initializes Paystack payment and stores a pending `Payment`.
4. Owner completes payment in Paystack popup.
5. Frontend calls verify endpoint with the reference.
6. Backend verifies with Paystack API.
7. On success, `Promotion.isBoosted = true` and `Promotion.boostPaymentRef` is saved.
8. Boosted promotion is shown first on the homepage with a `★ Featured` badge.

## Entity Relationship Summary

- User -> Business: one-to-many
- User -> Inquiry: one-to-many
- User -> Payment: one-to-many
- Business -> Product: one-to-many
- Business -> Promotion: one-to-many
- Business -> Inquiry: one-to-many
- Business -> Payment: one-to-many
- Promotion -> Payment: one-to-one for boost

## Core Modules

| Module | Responsibility |
| --- | --- |
| Auth | Registration, login, JWT generation |
| Business | Business profile CRUD and listing visibility |
| Product | Product CRUD for business owners |
| Promotion | Promotion CRUD and boosted ordering |
| Inquiry | Customer-to-owner messages |
| Search | Regex discovery by name, category, description, category filter and state filter |
| Payment | Paystack initialization, verification and history |

## Deployment Notes

The backend requires `MONGO_URI`, `JWT_SECRET`, `PAYSTACK_SECRET_KEY` and `CLIENT_URL`. The frontend requires `VITE_API_URL` and `VITE_PAYSTACK_PUBLIC_KEY`.
