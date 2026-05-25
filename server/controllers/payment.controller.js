const axios = require('axios');
const Business = require('../models/Business');
const Payment = require('../models/Payment');
const Promotion = require('../models/Promotion');

const PAYSTACK_BASE_URL = 'https://api.paystack.co/transaction';
const AMOUNTS = { listing: 200000, boost: 50000 };

const paystackHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json'
});

const generateReference = (type) => `BIZPROMO-${type.toUpperCase()}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

/**
 * Initialize a Paystack payment and save the pending payment record.
 */
exports.initializePayment = async (req, res, next) => {
  try {
    const { type, businessId, promotionId } = req.body;
    if (!['listing', 'boost'].includes(type)) return res.status(400).json({ success: false, data: null, message: 'Invalid payment type' });
    if (!businessId) return res.status(400).json({ success: false, data: null, message: 'Business ID is required' });

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    if (business.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, data: null, message: 'Only the business owner can initialize payment' });
    }

    let promotion = null;
    if (type === 'boost') {
      promotion = await Promotion.findById(promotionId);
      if (!promotion || promotion.business.toString() !== business._id.toString()) {
        return res.status(404).json({ success: false, data: null, message: 'Promotion not found for this business' });
      }
    }

    const reference = generateReference(type);
    const amount = AMOUNTS[type];
    const payload = {
      email: req.user.email,
      amount,
      reference,
      metadata: { type, businessId, promotionId: promotion?._id?.toString() }
    };

    const { data } = await axios.post(`${PAYSTACK_BASE_URL}/initialize`, payload, { headers: paystackHeaders() });
    await Payment.create({ user: req.user._id, business: business._id, promotion: promotion?._id, type, amount, reference, status: 'pending', paystackResponse: data });

    res.status(201).json({
      success: true,
      data: { authorization_url: data.data.authorization_url, reference, amount },
      message: 'Payment initialized'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify a Paystack payment server-side and update listing or boost status.
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const payment = await Payment.findOne({ reference, user: req.user._id });
    if (!payment) return res.status(404).json({ success: false, data: null, message: 'Payment not found' });

    const { data } = await axios.get(`${PAYSTACK_BASE_URL}/verify/${reference}`, { headers: paystackHeaders() });
    const verified = data?.data?.status === 'success';
    payment.status = verified ? 'success' : 'failed';
    payment.paystackResponse = data;
    await payment.save();

    if (verified && payment.type === 'listing') {
      await Business.findByIdAndUpdate(payment.business, { isListed: true });
    }
    if (verified && payment.type === 'boost') {
      await Promotion.findByIdAndUpdate(payment.promotion, { isBoosted: true, boostPaymentRef: reference });
    }

    res.json({
      success: verified,
      data: { type: payment.type, amount: payment.amount, reference, status: payment.status },
      message: verified ? 'Payment verified successfully' : 'Payment verification failed'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return payment history for the authenticated owner.
 */
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate('business', 'name').populate('promotion', 'title').sort({ createdAt: -1 });
    res.json({ success: true, data: payments, message: 'Payment history fetched' });
  } catch (error) {
    next(error);
  }
};
