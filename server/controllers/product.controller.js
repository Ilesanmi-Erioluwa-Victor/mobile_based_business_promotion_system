const Business = require('../models/Business');
const Product = require('../models/Product');

const fileUrl = (req) => (req.file ? `/uploads/${req.file.filename}` : undefined);
const owns = (business, user) => business.owner.toString() === user._id.toString() || user.role === 'admin';

/**
 * List products for a business.
 */
exports.getProductsByBusiness = async (req, res, next) => {
  try {
    const products = await Product.find({ business: req.params.businessId || req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: products, message: 'Products fetched' });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a product to a business owned by the authenticated owner.
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { businessId, name, description, price, inStock } = req.body;
    if (!businessId || !name) return res.status(400).json({ success: false, data: null, message: 'Business and product name are required' });
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ success: false, data: null, message: 'Business not found' });
    if (!owns(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the business owner can add products' });
    const product = await Product.create({ business: businessId, name, description, price, inStock, imageUrl: fileUrl(req) });
    res.status(201).json({ success: true, data: product, message: 'Product created' });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a product if the authenticated user owns the parent business.
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, data: null, message: 'Product not found' });
    const business = await Business.findById(product.business);
    if (!owns(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the owner can update this product' });
    Object.assign(product, req.body);
    if (req.file) product.imageUrl = fileUrl(req);
    await product.save();
    res.json({ success: true, data: product, message: 'Product updated' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product if the authenticated user owns the parent business.
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, data: null, message: 'Product not found' });
    const business = await Business.findById(product.business);
    if (!owns(business, req.user)) return res.status(403).json({ success: false, data: null, message: 'Only the owner can delete this product' });
    await product.deleteOne();
    res.json({ success: true, data: null, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
