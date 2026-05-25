const Business = require('../models/Business');

/**
 * Search listed businesses by keyword, category and state.
 */
exports.searchBusinesses = async (req, res, next) => {
  try {
    const { q, category, state, page = 1, limit = 10 } = req.query;
    const filter = { isListed: true };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (category) filter.category = { $regex: `^${category}$`, $options: 'i' };
    if (state) filter.state = { $regex: `^${state}$`, $options: 'i' };

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const [items, total] = await Promise.all([
      Business.find(filter).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
      Business.countDocuments(filter)
    ]);
    res.json({ success: true, data: { items, page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) }, message: 'Search completed' });
  } catch (error) {
    next(error);
  }
};
