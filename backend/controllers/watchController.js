const Watch = require('../models/Watch');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Promotion = require('../models/Promotion');

// Get all watches
exports.getAllWatches = async (req, res) => {
    try {
        const { filter, minPrice, maxPrice, brand, limit } = req.query;

        let query = {};

        if (filter === 'new-arrivals') {
            //query = {}; // Không lọc gì thêm, chỉ sort
        } else if (filter === 'best-sellers') {
            // Lấy 10 đồng hồ có tổng số lượng mua nhiều nhất
            const topWatches = await Order.aggregate([
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.watchID",
                        totalQuantity: { $sum: "$items.quantity" },
                    },
                },
                { $sort: { totalQuantity: -1 } },
                { $limit: 10 },
            ]);

            const watchIDs = topWatches.map((item) => item._id);
            query._id = { $in: watchIDs };
        }

        if (minPrice && maxPrice) {
            query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
        }

        if (brand) {
            const brandNames = brand.split(',').map(name => name.trim());
            const brands = await Brand.find({ name: { $in: brandNames } });
            if (brands.length > 0) {
                query.brandID = { $in: brands.map((b) => b._id) };
            }
        }
        //   console.log("Query being executed:", query);

        let watchesQuery = Watch.find(query)
            .populate('brandID')
            .populate('category_id')

        if (filter === 'new-arrivals') {
            watchesQuery = watchesQuery.sort({ _id: -1 }).limit(parseInt(limit) || 0);
        }

        const watches = await watchesQuery;
        res.status(200).json(watches);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving watches', error });
        //   res.status(500).json({ message: 'Error retrieving watches', error });
    }
};

exports.getDiscountedProducts = async (req, res) => {
    try {
      const now = new Date();
      
      // Find promotions that are active
      const promotions = await Promotion.find({
        startDate: { $lte: now },
        endDate: { $gte: now },
      }).populate('watchID'); // Populate watch details
  
      // Format response to include product details and discount
      const discountedProducts = promotions.flatMap((promo) =>
        promo.watchID.map((watch) => ({
          ...watch.toObject(),
          discount: promo.discount, // Add discount percentage to the product
          discountedPrice: (watch.price * (1 - promo.discount / 100)).toFixed(2),
        }))
      );
  
      res.status(200).json(discountedProducts);
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const User = require('../models/User');
  exports.toggleWishlist = async (req, res) => {
    const { userID } = req.params;
    const { watchID } = req.body;
  
    try {
      const user = await User.findById(userID);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Kiểm tra sản phẩm đã có trong wishlist hay chưa
      const isInWishlist = user.wishlist.includes(watchID);
  
      if (isInWishlist) {
        // Nếu đã có thì xóa khỏi wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== watchID);
        await user.save();
        return res.status(200).json({ message: 'Removed from wishlist', wishlist: user.wishlist });
      } else {
        // Nếu chưa có thì thêm vào wishlist
        user.wishlist.push(watchID);
        await user.save();
        return res.status(200).json({ message: 'Added to wishlist', wishlist: user.wishlist });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Get a single watch by ID
exports.getWatchById = async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.id);
        if (!watch) {
            return res.status(404).json({ message: 'Watch not found' });
        }
        res.status(200).json(watch);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving watch', error });
    }
};


exports.addProduct = async (req, res) => {
    try {
        const { name, stock_quantity, brand, price, description, category, newBrand, newCategory } = req.body;

        // Xử lý Brand
        let brandID;
        if (brand === 'new') {
            if (!newBrand) return res.status(400).json({ message: "Brand name is required." });

            // Kiểm tra xem brand mới có tồn tại trong DB chưa
            const existingBrand = await Brand.findOne({ name: newBrand.toLowerCase() });
            if (existingBrand) {
                brandID = existingBrand._id; // Nếu có rồi, lấy ID của brand cũ
            } else {
                // Nếu chưa có, tạo brand mới và lấy ID
                const newBrandObj = new Brand({ name: newBrand.toLowerCase() });
                const savedBrand = await newBrandObj.save();
                brandID = savedBrand._id;
            }
        } else if (brand !== 'select') {  // Nếu chọn brand có sẵn
            const existingBrand = await Brand.findOne({ name: brand.toLowerCase() });
            if (existingBrand) {
                brandID = existingBrand._id;  // Lấy ID của brand đã có
            } else {
                return res.status(400).json({ message: "Brand not found." });  // Nếu không có, báo lỗi
            }
        }

        // Xử lý Category
        let category_id;
        if (category === 'new') {
            if (!newCategory) return res.status(400).json({ message: "Category name is required." });

            // Kiểm tra xem category mới có tồn tại trong DB chưa
            const existingCategory = await Category.findOne({ name: newCategory.toLowerCase() });
            if (existingCategory) {
                category_id = existingCategory._id;  // Nếu có rồi, lấy ID của category cũ
            } else {
                // Nếu chưa có, tạo category mới và lấy ID
                const newCategoryObj = new Category({ name: newCategory.toLowerCase() });
                const savedCategory = await newCategoryObj.save();
                category_id = savedCategory._id;
            }
        } else if (category !== 'select') {  // Nếu chọn category có sẵn
            const existingCategory = await Category.findOne({ name: category.toLowerCase() });
            if (existingCategory) {
                category_id = existingCategory._id;  // Lấy ID của category đã có
            } else {
                return res.status(400).json({ message: "Category not found." });  // Nếu không có, báo lỗi
            }
        }


        // Xử lý upload hình ảnh
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => ({
                image_url: `/uploads/images/${file.filename}`,
                alt_text: file.originalname || "Product Image"
            }));
        } else {
            console.log("No files uploaded.");
        }


        // Tạo sản phẩm mới
        const newProduct = new Watch({
            name,
            stock_quantity,
            price,
            description,
            brandID,
            category_id,
            images,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Update a watch by ID
exports.updateWatch = async (req, res) => {
    try {
        const { name, price, stock_quantity, description, brandID, category_id } = req.body;
        const images = req.files; // Multer handles file uploads

        // Kiểm tra thông tin nhận được từ request
        console.log('Request body:', req.body);
        console.log('Files:', req.files);

        // Find the watch by ID and update it
        const watch = await Watch.findById(req.params.id);

        watch.name = name || watch.name;
        watch.price = price || watch.price;
        watch.stock_quantity = stock_quantity || watch.stock_quantity;
        watch.description = description || watch.description;
        // Cập nhật brand và category nếu có
        watch.brandID = brandID || watch.brandID;
        watch.category_id = category_id || watch._id;
        // Update images if new images are uploaded
        if (images && images.length > 0) {
            watch.images = images.map((file) => ({
                image_url: `/uploads/images/${file.filename}`,
                alt_text: file.originalname || "Product Image"
            }));
        }

        await watch.save();
        res.status(200).json({ message: 'Product updated successfully', watch });
    } catch (error) {
        console.error('Product no change', error); // Log chi tiết lỗi 
    }
};



// Updated controller to match the PUT request
exports.hideProduct = async (req, res) => {
    try {
        const productId = req.params.id;  // Retrieve the 'id' from URL parameter
        console.log('Hiding product with ID:', productId);

        // Tìm và cập nhật sản phẩm với isDeleted = true
        const updatedProduct = await Watch.findByIdAndUpdate(
            productId,
            { isDeleted: true },
            { new: true }  // Trả về sản phẩm sau khi cập nhật
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product hidden successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error hiding product:', error);
        res.status(500).json({ message: 'Error hiding product', error: error.message || error });
    }
};
// Controller để phục hồi sản phẩm
exports.restoreProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Lấy ID từ URL
        console.log('Đang phục hồi sản phẩm với ID:', productId);

        // Cập nhật trạng thái isDeleted thành false
        const restoredProduct = await Watch.findByIdAndUpdate(
            productId,
            { isDeleted: false },
            { new: true } // Trả về sản phẩm sau khi cập nhật
        );

        if (!restoredProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }

        res.status(200).json({ message: 'Sản phẩm đã được phục hồi', product: restoredProduct });
    } catch (error) {
        console.error('Lỗi khi phục hồi sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi phục hồi sản phẩm', error: error.message || error });
    }
};



