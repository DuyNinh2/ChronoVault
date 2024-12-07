const Watch = require('../models/Watch');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Order = require('../models/Order');

// Get all watches
exports.getAllWatches = async (req, res) => {
    try {
        const { filter, minPrice, maxPrice, brand, limit } = req.query;
  
      let query = { isDeleted: false };
  
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
        const { name, stock_quantity, brand, price, description, category, newBrand, newCategory, images } = req.body;

        // Xử lý Brand
        let brandID;
        if (brand === 'new') {
            if (!newBrand) return res.status(400).json({ message: "Brand name is required." });

            const existingBrand = await Brand.findOne({ name: newBrand.toLowerCase() });
            if (existingBrand) {
                brandID = existingBrand._id;
            } else {
                const newBrandObj = new Brand({ name: newBrand.toLowerCase() });
                const savedBrand = await newBrandObj.save();
                brandID = savedBrand._id;
            }
        } else if (brand !== 'select') {
            const existingBrand = await Brand.findOne({ name: brand.toLowerCase() });
            if (existingBrand) {
                brandID = existingBrand._id;
            } else {
                return res.status(400).json({ message: "Brand not found." });
            }
        }

        // Xử lý Category
        let category_id;
        if (category === 'new') {
            if (!newCategory) return res.status(400).json({ message: "Category name is required." });

            const existingCategory = await Category.findOne({ name: newCategory.toLowerCase() });
            if (existingCategory) {
                category_id = existingCategory._id;
            } else {
                const newCategoryObj = new Category({ name: newCategory.toLowerCase() });
                const savedCategory = await newCategoryObj.save();
                category_id = savedCategory._id;
            }
        } else if (category !== 'select') {
            const existingCategory = await Category.findOne({ name: category.toLowerCase() });
            if (existingCategory) {
                category_id = existingCategory._id;
            } else {
                return res.status(400).json({ message: "Category not found." });
            }
        }

        // Xử lý upload hình ảnh (Nếu có ảnh mới)
        let updatedImages = [];
        if (req.files && req.files.length > 0) {
            updatedImages = req.files.map(file => ({
                image_url: `/uploads/images/${file.filename}`,
                alt_text: file.originalname || "Product Image"
            }));
        } else {
            updatedImages = images; // Giữ lại ảnh cũ nếu không có ảnh mới
        }

        // Cập nhật sản phẩm
        const updatedWatch = await Watch.findByIdAndUpdate(req.params.id, {
            name,
            stock_quantity,
            price,
            description,
            brandID,
            category_id,
            images: updatedImages
        }, { new: true });

        if (!updatedWatch) {
            return res.status(404).json({ message: 'Watch not found' });
        }

        res.status(200).json({ message: 'Watch updated successfully', watch: updatedWatch });
    } catch (error) {
        console.error('Error updating watch:', error);
        res.status(500).json({ message: 'Error updating watch', error });
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



