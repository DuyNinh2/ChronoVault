const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/api/categories', categoryController.getAllCategory);

module.exports = router;
