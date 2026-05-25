const Business = require('../models/Business');
const Inquiry = require('../models/Inquiry');

const owns = (business, user) => business.owner.toString() === user._id.toString() || user.role === 'admin';

/**
 * Send an inquiry to a business from an authenticated user.
 */
exports.createInquiry = async (req, res, next) => {
  try {
    const { businessId, message, senderName, senderEmail } = req.body;
    if (!businessId || !message) return res.status(400).json({ success: false, data: null, message: 'Business and message are required' });
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    const inquiry = await Inquiry.create({
      business: businessId,
      sender: req.user._id,
      senderName: senderName || req.user.name,
      senderEmail: senderEmail || req.user.email,
      message
    });
    res.status(201).json({ success: true, data: inquiry, message: 'Inquiry sent' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all inquiries for a business owned by the authenticated owner.
 */
exports.getInquiriesByBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    if (!owns(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the owner can view inquiries' });
    const inquiries = await Inquiry.find({ business: business._id }).populate('sender', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries, message: 'Inquiries fetched' });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark one inquiry as read if the authenticated user owns the business.
 */
exports.markInquiryRead = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, data: null, message: 'Inquiry not found' });
    const business = await Business.findById(inquiry.business);
    if (!owns(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the owner can update inquiries' });
    inquiry.isRead = true;
    await inquiry.save();
    res.json({ success: true, data: inquiry, message: 'Inquiry marked as read' });
  } catch (error) {
    next(error);
  }
};
