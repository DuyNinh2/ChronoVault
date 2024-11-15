const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController');

// Define routes
router.get('/api/watches', watchController.getAllWatches);
router.get('/:id', watchController.getWatchById);

//admin manage
router.post('/product-management', watchController.addProduct);


// router.get('/api/brands', async (req, res) => {
//     try {
//         const brands = await Brand.find(); // Hoặc tương tự với mô hình Brand của bạn
//         res.status(200).json(brands);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi lấy thông tin thương hiệu', error });
//     }
// });

// router.get('/api/categories', async (req, res) => {
//     try {
//         const categories = await Category.find(); // Hoặc tương tự với mô hình Category của bạn
//         res.status(200).json(categories);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi lấy thông tin danh mục', error });
//     }
// });



module.exports = router;
