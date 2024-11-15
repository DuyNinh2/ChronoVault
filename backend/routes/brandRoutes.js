// routes/brandRoutes.js
const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

router.get('/api/brands', brandController.getAllBrands);

module.exports = router;
