const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: String,
  address: String,
  state: String,
  phone: String,
  email: String,
  logoUrl: String,
  coverImageUrl: String,
  isVerified: { type: Boolean, default: false },
  isListed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', businessSchema);
