const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createPromotion,
  deletePromotion,
  getActivePromotions,
  getMyPromotions,
  getPromotionsByBusiness
} = require('../controllers/promotion.controller');

const router = express.Router();

router.get('/', getActivePromotions);
router.get('/mine', protect, getMyPromotions);
router.get('/business/:businessId', getPromotionsByBusiness);
router.post('/', protect, upload.single('image'), createPromotion);
router.delete('/:id', protect, deletePromotion);

module.exports = router;
