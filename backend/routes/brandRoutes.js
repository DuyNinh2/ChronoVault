const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// Route để lấy tất cả các thương hiệu
router.get('/api/brands', brandController.getAllBrands);

module.exports = router;
