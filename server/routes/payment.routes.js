const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getPaymentHistory,
  initializePayment,
  verifyPayment
} = require('../controllers/payment.controller');

const router = express.Router();

router.post('/initialize', protect, authorize('owner', 'admin'), initializePayment);
router.get('/verify/:reference', protect, verifyPayment);
router.get('/history', protect, authorize('owner', 'admin'), getPaymentHistory);

module.exports = router;
