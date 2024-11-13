const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/create-account', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

module.exports = router;