const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

router.get('/api/promotions', promotionController.getAllPromotion);
router.post('/api/addpromotions', promotionController.addPromotion); // Đảm bảo đường dẫn đúng
router.put('/api/updatepromotions/:id', promotionController.updatePromotion);
router.delete('/api/deletepromotions/:id', promotionController.deletePromotion);
router.get('/api/promotions/:id', promotionController.getPromotionById);

module.exports = router;
