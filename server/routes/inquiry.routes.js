const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createInquiry,
  getInquiriesByBusiness,
  markInquiryRead
} = require('../controllers/inquiry.controller');

const router = express.Router();

router.post('/', protect, createInquiry);
router.get('/business/:id', protect, getInquiriesByBusiness);
router.patch('/:id/read', protect, markInquiryRead);

module.exports = router;
