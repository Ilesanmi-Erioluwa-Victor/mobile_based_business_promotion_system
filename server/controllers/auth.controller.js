const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isSubscribed: user.isSubscribed,
  subscriptionExpiry: user.subscriptionExpiry
});

/**
 * Register a new BizPromo user and return a JWT token.
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, data: null, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, data: null, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    const token = signToken(user);

    res.status(201).json({ success: true, data: { token, user: publicUser(user) }, message: 'Registration successful' });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate a user with email and password and return a JWT token.
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, data: null, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, data: null, message: 'Invalid password' });
    }

    const token = signToken(user);
    res.json({ success: true, data: { token, user: publicUser(user) }, message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};
