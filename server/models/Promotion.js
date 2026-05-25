const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  title: { type: String, required: true, trim: true },
  description: String,
  discount: String,
  startDate: Date,
  endDate: Date,
  imageUrl: String,
  isActive: { type: Boolean, default: true },
  isBoosted: { type: Boolean, default: false },
  boostPaymentRef: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Promotion', promotionSchema);
