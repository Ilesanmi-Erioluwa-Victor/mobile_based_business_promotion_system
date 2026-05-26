# BizPromo — Software Documentation

## 1. Project Overview

**Full project title:** Design and Implementation of a Mobile-Based Business Promotion System for Small Scale Enterprises  
**Institution:** Delta State Polytechnic, Otefe-Oghara

**Abstract:** BizPromo is a mobile-based web system that helps small-scale enterprises create business profiles, list products, publish promotions and receive customer inquiries. The system integrates Paystack payment processing so owners can pay a one-time listing fee and boost selected promotions for homepage visibility. Its goal is to provide affordable digital market reach for small-scale Nigerian enterprises.

## 2. System Objectives

1. Enable business owners to register and publish business profiles.
2. Allow owners to pay a one-time listing fee (₦2,000) via Paystack to go live.
3. Allow owners to pay a promotion boost fee (₦500) to feature promotions on the homepage.
4. Enable customers to discover and contact businesses.
5. Provide a payment history log for owners.
6. Secure all transactions with Paystack's verified payment gateway.
7. Implement role-based access for customers, owners, and admins.

## 3. Tech Stack

| Layer    | Technology             | Purpose                                         |
| -------- | ---------------------- | ----------------------------------------------- |
| Frontend | React.js with Vite     | Responsive user interface                       |
| Styling  | TailwindCSS            | Mobile-first layout and reusable UI             |
| Backend  | Node.js and Express.js | REST API and business logic                     |
| Database | MongoDB with Mongoose  | Persistent document storage                     |
| Auth     | JWT and bcrypt         | Login security and password hashing             |
| Payments | Paystack Inline JS     | Frontend payment popup                          |
| Payments | Paystack REST API      | Backend payment initialization and verification |
| HTTP     | axios                  | Client API calls and backend Paystack calls     |

## 4. System Architecture

BizPromo uses a three-tier architecture:

1. Presentation tier: React components, pages, hooks and services.
2. Application tier: Express controllers, routes, middleware and validation.
3. Data tier: MongoDB collections managed through Mongoose models.

Payment flow: React `PaystackButton` -> Express `/api/payments` -> Paystack API -> MongoDB `Payment` collection.

## 5. Database Design

- User: stores account identity, hashed password, role and subscription flags.
- Business: stores owner business profile data, listing status and media URLs.
- Product: stores products connected to a business.
- Promotion: stores active offers, boost status and boost payment reference.
- Inquiry: stores customer messages sent to business owners.
- Payment: stores user, business, promotion, payment type, amount, reference, status and Paystack response.

## 6. API Endpoints Reference

| Method | Endpoint                               | Purpose                                   |
| ------ | -------------------------------------- | ----------------------------------------- |
| POST   | `/api/auth/register`                   | Register user and return JWT              |
| POST   | `/api/auth/login`                      | Login user and return JWT                 |
| GET    | `/api/businesses`                      | List listed businesses                    |
| GET    | `/api/businesses/:id`                  | Get business with products and promotions |
| POST   | `/api/businesses`                      | Create business profile                   |
| PUT    | `/api/businesses/:id`                  | Update owned business                     |
| DELETE | `/api/businesses/:id`                  | Delete owned business                     |
| GET    | `/api/products/business/:businessId`   | List products                             |
| POST   | `/api/products`                        | Add product                               |
| PUT    | `/api/products/:id`                    | Update product                            |
| DELETE | `/api/products/:id`                    | Delete product                            |
| GET    | `/api/promotions/business/:businessId` | List business promotions                  |
| POST   | `/api/promotions`                      | Create promotion                          |
| DELETE | `/api/promotions/:id`                  | Delete promotion                          |
| POST   | `/api/inquiries`                       | Send inquiry                              |
| GET    | `/api/inquiries/business/:id`          | View business inquiries                   |
| PATCH  | `/api/inquiries/:id/read`              | Mark inquiry as read                      |
| GET    | `/api/search`                          | Search listed businesses                  |
| POST   | `/api/payments/initialize`             | Initialize listing or boost payment       |
| GET    | `/api/payments/verify/:reference`      | Verify Paystack payment                   |
| GET    | `/api/payments/history`                | Return owner payment history              |

## 7. Features

### 7.1 For Business Owners

Owners can register, create a business profile, add products, create promotions, pay the listing fee, pay to boost a promotion, view inquiries and view payment history.

### 7.2 For Customers

Customers can register, search listed businesses, view business profiles, browse products and promotions, and send inquiries.

### 7.3 Admin Features

Admins can access protected system areas and monitor listed businesses.

## 8. Security Measures

Passwords are hashed with bcrypt, protected routes require JWT authentication, role checks restrict owner/admin operations, and payment status is verified server-side with Paystack before database updates. The frontend payment result is never trusted alone. Paystack webhook signature verification is planned for future implementation.

## 9. Limitations

Payment is one-time listing only, with no recurring billing. No Paystack webhook is implemented; polling-based verification is used instead. The current admin panel is basic and intended for school project demonstration.

## 10. Future Work

Future upgrades include Paystack recurring billing for monthly subscriptions, webhook integration, a payment analytics dashboard, richer admin moderation, SMS notifications and advanced recommendation search.
