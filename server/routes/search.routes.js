const express = require('express');
const { searchBusinesses } = require('../controllers/search.controller');

const router = express.Router();

router.get('/', searchBusinesses);

module.exports = router;
