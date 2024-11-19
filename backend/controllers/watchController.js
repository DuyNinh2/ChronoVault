const Watch = require('../models/Watch');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

// Get all watches
exports.getAllWatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        const watches = await Watch.find()
            .populate('brandID')
            .populate('category_id')
            .sort({ _id: -1 }) 
            .limit(limit);
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

// Admin add product
exports.addProduct = async (req, res) => {
    try {
        const { name, stock_quantity, brand, price, description, category, images, newBrand, newCategory } = req.body;

        let brandID, categoryID;

        // Check if a new brand is being added
        if (brand === 'new') {
            if (!newBrand) return res.status(400).json({ message: "Brand name is required." });
            const brandExist = await Brand.findOne({ name: newBrand });
            if (brandExist) {
                brandID = brandExist._id;
            } else {
                const newBrandObj = new Brand({ name: newBrand });
                const savedBrand = await newBrandObj.save();
                brandID = savedBrand._id;
            }
        } else {
            const existingBrand = await Brand.findOne({ name: brand });
            if (existingBrand) {
                brandID = existingBrand._id;
            } else {
                return res.status(400).json({ message: "Brand not found." });
            }
        }

        // Check if a new category is being added
        if (category === 'new') {
            if (!newCategory) return res.status(400).json({ message: "Category name is required." });
            const categoryExist = await Category.findOne({ name: newCategory });
            if (categoryExist) {
                categoryID = categoryExist._id;
            } else {
                const newCategoryObj = new Category({ name: newCategory });
                const savedCategory = await newCategoryObj.save();
                categoryID = savedCategory._id;
            }
        } else {
            const existingCategory = await Category.findOne({ name: category });
            if (existingCategory) {
                categoryID = existingCategory._id;
            } else {
                return res.status(400).json({ message: "Category not found." });
            }
        }

        // Create new product
        const newProduct = new Watch({
            name,
            stock_quantity,
            brandID,
            price,
            description,
            categoryID,
            images
        });

        // Save new product
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        console.error('Error while adding product:', error);  // Log full error message for debugging
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    }
};







