const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const axios = require('axios');
const app = require('../server');
const Business = require('../models/Business');
const Inquiry = require('../models/Inquiry');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');
const User = require('../models/User');

jest.mock('axios');

let mongo;
let ownerToken;
let customerToken;
let owner;
let customer;
let listedBusiness;
let unlistedBusiness;
let product;
let promotion;
let inquiry;

const register = (payload) => request(app).post('/api/auth/register').send(payload);

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  process.env.PAYSTACK_SECRET_KEY = 'sk_test_mock';
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Business.deleteMany({}),
    Product.deleteMany({}),
    Promotion.deleteMany({}),
    Inquiry.deleteMany({}),
    Payment.deleteMany({})
  ]);
  const ownerRes = await register({ name: 'Owner One', email: 'owner@test.com', password: 'password123', role: 'owner' });
  const customerRes = await register({ name: 'Customer One', email: 'customer@test.com', password: 'password123', role: 'customer' });
  ownerToken = ownerRes.body.data.token;
  customerToken = customerRes.body.data.token;
  owner = await User.findOne({ email: 'owner@test.com' });
  customer = await User.findOne({ email: 'customer@test.com' });
  listedBusiness = await Business.create({ owner: owner._id, name: 'Food Hub', category: 'Food', state: 'Lagos', description: 'Fresh food store', isListed: true });
  unlistedBusiness = await Business.create({ owner: owner._id, name: 'Hidden Store', category: 'Fashion', state: 'Delta', description: 'Unlisted store', isListed: false });
  product = await Product.create({ business: listedBusiness._id, name: 'Rice Bag', price: 10000 });
  promotion = await Promotion.create({ business: listedBusiness._id, title: 'Promo Deal', description: 'Discount now' });
  inquiry = await Inquiry.create({ business: listedBusiness._id, sender: customer._id, senderName: 'Customer One', senderEmail: 'customer@test.com', message: 'Hello' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Auth', () => {
  test('POST /api/auth/register — creates new user, returns JWT token', async () => {
    const res = await register({ name: 'New User', email: 'new@test.com', password: 'password123', role: 'customer' });
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeTruthy();
  });

  test('POST /api/auth/register — returns 400 on duplicate email', async () => {
    const res = await register({ name: 'Owner One', email: 'owner@test.com', password: 'password123', role: 'owner' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register — returns 400 on missing fields', async () => {
    const res = await register({ email: 'missing@test.com' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login — returns token on valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'owner@test.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
  });

  test('POST /api/auth/login — returns 401 on wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'owner@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login — returns 404 on non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'none@test.com', password: 'password123' });
    expect(res.status).toBe(404);
  });
});

describe('Businesses', () => {
  test('GET /api/businesses — returns only isListed businesses, paginated', async () => {
    const res = await request(app).get('/api/businesses?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
  });

  test('GET /api/businesses/:id — returns business with products and promotions', async () => {
    const res = await request(app).get(`/api/businesses/${listedBusiness._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.products).toHaveLength(1);
    expect(res.body.data.promotions).toHaveLength(1);
  });

  test('GET /api/businesses/:id — returns 404 for invalid ID', async () => {
    const res = await request(app).get('/api/businesses/not-valid');
    expect(res.status).toBe(404);
  });

  test('POST /api/businesses — creates business with isListed: false when authenticated as owner', async () => {
    const res = await request(app).post('/api/businesses').set('Authorization', `Bearer ${ownerToken}`).send({ name: 'New Biz', category: 'Tech' });
    expect(res.status).toBe(201);
    expect(res.body.data.isListed).toBe(false);
  });

  test('POST /api/businesses — returns 401 without auth token', async () => {
    const res = await request(app).post('/api/businesses').send({ name: 'New Biz', category: 'Tech' });
    expect(res.status).toBe(401);
  });

  test('PUT /api/businesses/:id — owner can update their business', async () => {
    const res = await request(app).put(`/api/businesses/${listedBusiness._id}`).set('Authorization', `Bearer ${ownerToken}`).send({ name: 'Food Hub Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Food Hub Updated');
  });

  test('PUT /api/businesses/:id — returns 403 if not the owner', async () => {
    const other = await register({ name: 'Other Owner', email: 'other@test.com', password: 'password123', role: 'owner' });
    const res = await request(app).put(`/api/businesses/${listedBusiness._id}`).set('Authorization', `Bearer ${other.body.data.token}`).send({ name: 'Bad' });
    expect(res.status).toBe(403);
  });

  test('DELETE /api/businesses/:id — owner can delete their business', async () => {
    const res = await request(app).delete(`/api/businesses/${unlistedBusiness._id}`).set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
  });
});

describe('Products', () => {
  test('GET /api/products/business/:id — returns all products for a business', async () => {
    const res = await request(app).get(`/api/products/business/${listedBusiness._id}`);
    expect(res.body.data).toHaveLength(1);
  });

  test('POST /api/products — owner can add a product', async () => {
    const res = await request(app).post('/api/products').set('Authorization', `Bearer ${ownerToken}`).send({ businessId: listedBusiness._id, name: 'Beans' });
    expect(res.status).toBe(201);
  });

  test('DELETE /api/products/:id — owner can delete a product', async () => {
    const res = await request(app).delete(`/api/products/${product._id}`).set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
  });
});

describe('Search', () => {
  test('GET /api/search?q=food — returns only isListed businesses matching query', async () => {
    const res = await request(app).get('/api/search?q=food');
    expect(res.body.data.items).toHaveLength(1);
  });

  test('GET /api/search?category=Tech — returns businesses filtered by category', async () => {
    const res = await request(app).get('/api/search?category=Tech');
    expect(res.body.data.items).toHaveLength(0);
  });

  test('GET /api/search?state=Lagos — returns businesses filtered by state', async () => {
    const res = await request(app).get('/api/search?state=Lagos');
    expect(res.body.data.items).toHaveLength(1);
  });

  test('GET /api/search?q=xyz_nonexistent — returns empty array, not error', async () => {
    const res = await request(app).get('/api/search?q=xyz_nonexistent');
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(0);
  });
});

describe('Inquiries', () => {
  test('POST /api/inquiries — authenticated user can send inquiry', async () => {
    const res = await request(app).post('/api/inquiries').set('Authorization', `Bearer ${customerToken}`).send({ businessId: listedBusiness._id, message: 'Can I order?' });
    expect(res.status).toBe(201);
  });

  test('POST /api/inquiries — returns 401 without auth token', async () => {
    const res = await request(app).post('/api/inquiries').send({ businessId: listedBusiness._id, message: 'Can I order?' });
    expect(res.status).toBe(401);
  });

  test('GET /api/inquiries/business/:id — owner gets their inquiries', async () => {
    const res = await request(app).get(`/api/inquiries/business/${listedBusiness._id}`).set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  test('PATCH /api/inquiries/:id/read — owner can mark inquiry as read', async () => {
    const res = await request(app).patch(`/api/inquiries/${inquiry._id}/read`).set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.isRead).toBe(true);
  });
});

describe('Payments', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { status: true, data: { authorization_url: 'https://checkout.paystack.test/pay' } } });
    axios.get.mockResolvedValue({ data: { status: true, data: { status: 'success' } } });
  });

  test('POST /api/payments/initialize — returns authorization_url and reference for listing type', async () => {
    const res = await request(app).post('/api/payments/initialize').set('Authorization', `Bearer ${ownerToken}`).send({ type: 'listing', businessId: listedBusiness._id });
    expect(res.status).toBe(201);
    expect(res.body.data.authorization_url).toBeTruthy();
  });

  test('POST /api/payments/initialize — returns authorization_url and reference for boost type', async () => {
    const res = await request(app).post('/api/payments/initialize').set('Authorization', `Bearer ${ownerToken}`).send({ type: 'boost', businessId: listedBusiness._id, promotionId: promotion._id });
    expect(res.status).toBe(201);
    expect(res.body.data.reference).toBeTruthy();
  });

  test('POST /api/payments/initialize — returns 401 without auth token', async () => {
    const res = await request(app).post('/api/payments/initialize').send({ type: 'listing', businessId: listedBusiness._id });
    expect(res.status).toBe(401);
  });

  test('GET /api/payments/verify/:reference — sets isListed: true on business after successful listing payment', async () => {
    const payment = await Payment.create({ user: owner._id, business: unlistedBusiness._id, type: 'listing', amount: 200000, reference: 'REF-LISTING' });
    const res = await request(app).get(`/api/payments/verify/${payment.reference}`).set('Authorization', `Bearer ${ownerToken}`);
    const updated = await Business.findById(unlistedBusiness._id);
    expect(res.status).toBe(200);
    expect(updated.isListed).toBe(true);
  });

  test('GET /api/payments/verify/:reference — sets isBoosted: true on promotion after successful boost payment', async () => {
    const payment = await Payment.create({ user: owner._id, business: listedBusiness._id, promotion: promotion._id, type: 'boost', amount: 50000, reference: 'REF-BOOST' });
    const res = await request(app).get(`/api/payments/verify/${payment.reference}`).set('Authorization', `Bearer ${ownerToken}`);
    const updated = await Promotion.findById(promotion._id);
    expect(res.status).toBe(200);
    expect(updated.isBoosted).toBe(true);
  });

  test('GET /api/payments/history — returns payment history for logged-in owner', async () => {
    await Payment.create({ user: owner._id, business: listedBusiness._id, type: 'listing', amount: 200000, reference: 'REF-HISTORY', status: 'success' });
    const res = await request(app).get('/api/payments/history').set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
