const mongoose = require('mongoose');
const Business = require('../models/Business');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');

const fileUrl = (req) => (req.file ? `/uploads/${req.file.filename}` : undefined);

const ownsBusiness = (business, user) => business.owner.toString() === user._id.toString() || user.role === 'admin';

/**
 * List paginated businesses that have paid the listing fee.
 */
exports.getBusinesses = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const [items, total] = await Promise.all([
      Business.find({ isListed: true }).populate('owner', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Business.countDocuments({ isListed: true })
    ]);
    res.json({ success: true, data: { items, page, limit, total, pages: Math.ceil(total / limit) }, message: 'Businesses fetched' });
  } catch (error) {
    next(error);
  }
};

/**
 * Return one business with its products and active promotions.
 */
exports.getBusinessById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    }
    const business = await Business.findById(req.params.id).populate('owner', 'name email');
    if (!business) return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    const [products, promotions] = await Promise.all([
      Product.find({ business: business._id }).sort({ createdAt: -1 }),
      Promotion.find({ business: business._id, isActive: true }).sort({ isBoosted: -1, createdAt: -1 })
    ]);
    res.json({ success: true, data: { business, products, promotions }, message: 'Business fetched' });
  } catch (error) {
    next(error);
  }
};

/**
 * Return the authenticated owner's first business for dashboard usage.
 */
exports.getMyBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: business, message: business ? 'Business fetched' : 'No business profile found' });
  } catch (error) {
    next(error);
  }
};

/**
 * Create an owner business profile and keep it unpublished until listing payment succeeds.
 */
exports.createBusiness = async (req, res, next) => {
  try {
    const { name, category, description, address, state, phone, email, coverImageUrl } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, data: null, message: 'Name and category are required' });
    }
    const business = await Business.create({
      owner: req.user._id,
      name,
      category,
      description,
      address,
      state,
      phone,
      email,
      coverImageUrl,
      logoUrl: fileUrl(req),
      isListed: false
    });
    res.status(201).json({ success: true, data: business, message: 'Business created. Complete listing payment to publish.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a business profile if the authenticated user owns it.
 */
exports.updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    if (!ownsBusiness(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the owner can update this business' });

    Object.assign(business, req.body);
    if (req.file) business.logoUrl = fileUrl(req);
    await business.save();
    res.json({ success: true, data: business, message: 'Business updated' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a business if the authenticated user owns it.
 */
exports.deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    if (!ownsBusiness(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the owner can delete this business' });
    await Promise.all([
      Product.deleteMany({ business: business._id }),
      Promotion.deleteMany({ business: business._id }),
      business.deleteOne()
    ]);
    res.json({ success: true, data: null, message: 'Business deleted' });
  } catch (error) {
    next(error);
  }
};
