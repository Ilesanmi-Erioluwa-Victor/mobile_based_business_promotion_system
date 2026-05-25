# BizPromo — Test Cases

## Automated API Test Groups

| Group | Coverage |
| --- | --- |
| Auth | Register, duplicate email, missing fields, login success, wrong password, non-existent email |
| Businesses | Listed-only pagination, detail view, invalid ID, create, unauthorized create, owner update, forbidden update, delete |
| Products | List by business, create product, delete product |
| Search | Query, category filter, state filter and empty result |
| Inquiries | Create inquiry, unauthorized inquiry, owner list, mark read |
| Payments | Initialize listing, initialize boost, unauthorized initialize, verify listing, verify boost, history |

## Payment Test Group

| Test ID | Description | Input | Expected Output | Pass/Fail |
| --- | --- | --- | --- | --- |
| PAY-01 | Initialize listing payment | `type=listing`, valid `businessId` | Authorization URL and reference returned | Pending |
| PAY-02 | Initialize boost payment | `type=boost`, valid `businessId`, `promotionId` | Authorization URL and reference returned | Pending |
| PAY-03 | Reject unauthenticated payment initialization | No JWT token | 401 response | Pending |
| PAY-04 | Verify successful listing payment | Existing pending listing reference | Business `isListed` becomes true | Pending |
| PAY-05 | Verify successful boost payment | Existing pending boost reference | Promotion `isBoosted` becomes true | Pending |
| PAY-06 | Fetch payment history | Owner JWT token | Owner payment records returned | Pending |

## Manual UI Payment Scenarios

### Scenario 1: Owner pays listing fee and sees business go live

1. Register or login as a business owner.
2. Create a business profile.
3. Open Dashboard.
4. Confirm yellow listing warning banner appears.
5. Click `Pay & Publish (₦2,000)`.
6. Complete Paystack test payment.
7. Confirm dashboard shows "Business is live and visible to customers".
8. Search for the business and confirm it appears in results.

### Scenario 2: Owner boosts promotion and sees featured badge

1. Login as a business owner with a listed business.
2. Create a promotion.
3. Open Promotions page.
4. Click `Boost (₦500)` on the promotion.
5. Complete Paystack test payment.
6. Confirm `★ Featured` badge appears.
7. Open Home page and confirm boosted promotion appears first.

## Running Tests

```bash
cd server
npm test
```
