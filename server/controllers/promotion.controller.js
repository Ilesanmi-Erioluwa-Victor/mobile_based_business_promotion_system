const Business = require('../models/Business');
const Promotion = require('../models/Promotion');

const fileUrl = (req) => (req.file ? `/uploads/${req.file.filename}` : undefined);
const owns = (business, user) => business.owner.toString() === user._id.toString() || user.role === 'admin';

/**
 * List active promotions for a business, with boosted promotions first.
 */
exports.getPromotionsByBusiness = async (req, res, next) => {
  try {
    const promotions = await Promotion.find({ business: req.params.businessId, isActive: true }).sort({ isBoosted: -1, createdAt: -1 });
    res.json({ success: true, data: promotions, message: 'Promotions fetched' });
  } catch (error) {
    next(error);
  }
};

/**
 * List all active promotions across listed businesses for homepage display.
 */
exports.getActivePromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find({ isActive: true })
      .populate({ path: 'business', match: { isListed: true }, select: 'name category state isListed' })
      .sort({ isBoosted: -1, createdAt: -1 })
      .limit(12);
    res.json({ success: true, data: promotions.filter((promo) => promo.business), message: 'Active promotions fetched' });
  } catch (error) {
    next(error);
  }
};

/**
 * List promotions for the authenticated owner's business.
 */
exports.getMyPromotions = async (req, res, next) => {
  try {
    const businesses = await Business.find({ owner: req.user._id }).select('_id');
    const promotions = await Promotion.find({ business: { $in: businesses.map((b) => b._id) } }).populate('business', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: promotions, message: 'Owner promotions fetched' });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a promotion for an owned business.
 */
exports.createPromotion = async (req, res, next) => {
  try {
    const { businessId, title, description, discount, startDate, endDate } = req.body;
    if (!businessId || !title) return res.status(400).json({ success: false, data: null, message: 'Business and title are required' });
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    if (!owns(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the owner can add promotions' });
    const promotion = await Promotion.create({ business: businessId, title, description, discount, startDate, endDate, imageUrl: fileUrl(req), isBoosted: false });
    res.status(201).json({ success: true, data: promotion, message: 'Promotion created' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a promotion if the authenticated user owns the parent business.
 */
exports.deletePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ success: false, data: null, message: 'Promotion not found' });
    const business = await Business.findById(promotion.business);
    if (!owns(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the owner can delete this promotion' });
    await promotion.deleteOne();
    res.json({ success: true, data: null, message: 'Promotion deleted' });
  } catch (error) {
    next(error);
  }
};
