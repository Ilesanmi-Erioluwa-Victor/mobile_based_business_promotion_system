const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createBusiness,
  deleteBusiness,
  getBusinessById,
  getBusinesses,
  getMyBusiness,
  updateBusiness
} = require('../controllers/business.controller');

const router = express.Router();

router.get('/', getBusinesses);
router.get('/me', protect, authorize('owner', 'admin'), getMyBusiness);
router.get('/:id', getBusinessById);
router.post('/', protect, authorize('owner', 'admin'), upload.single('logo'), createBusiness);
router.put('/:id', protect, upload.single('logo'), updateBusiness);
router.delete('/:id', protect, deleteBusiness);

module.exports = router;
