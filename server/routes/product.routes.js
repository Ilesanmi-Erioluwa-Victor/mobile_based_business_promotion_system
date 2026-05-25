const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createProduct,
  deleteProduct,
  getProductsByBusiness,
  updateProduct
} = require('../controllers/product.controller');

const router = express.Router();

router.get('/business/:businessId', getProductsByBusiness);
router.post('/', protect, upload.single('image'), createProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
