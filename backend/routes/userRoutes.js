const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create-account', userController.registerUser);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);

router.get('/user-management', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/:userID/address', userController.saveUserAddress);

module.exports = router;

