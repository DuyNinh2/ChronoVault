const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create-account', userController.registerUser);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);

router.get('/user-management', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/:userID/address', userController.saveUserAddress);
router.get("/wishlist/:userId", userController.getWishlist);

router.get('/setting/:id', userController.getUserSettings);
router.put('/setting/:id', userController.updateUserSettings);
router.post('/add/:userID/addresses', userController.addAddress);
router.delete("/addresses/:userID/:addressID", userController.deleteAddress);
router.put("/change-password/:userID", userController.changePassword);

module.exports = router;

