const Watch = require('../models/Watch');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

// Get all watches
exports.getAllWatches = async (req, res) => {
    try {
        const watches = await Watch.find()
            .populate('brandID')
            .populate('category_id');
        res.status(200).json(watches);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving watches', error });
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
        if (req.files && req.files.images) {
            const uploadedFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            images = uploadedFiles.map(file => ({
                image_url: `/uploads/${file.filename}`,
                alt_text: file.originalname || "Product Image"
            }));
        }

        // Tạo sản phẩm mới
        const newProduct = new Watch({
            name,
            stock_quantity,
            price,
            description,
            brandID,
            category_id,
            images
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

