const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: String,
  senderEmail: String,
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
