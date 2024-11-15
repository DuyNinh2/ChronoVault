// routes/brandRoutes.js
const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

router.get('/brands', brandController.getAllBrands); // Make sure the path is correct

module.exports = router;
