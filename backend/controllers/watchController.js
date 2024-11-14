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

// Admin add product
exports.addProduct = async (req, res) => {
    try {
        const { name, stock_quantity, brand, price, description, category, images } = req.body;

        const existingBrand = await Brand.findOne({ name: brand });
        const existingCategory = await Category.findOne({ name: category });

        let brandID, categoryID;
        if (!existingBrand) {
            const newBrand = new Brand({ name: brand });
            await newBrand.save();
            brandID = newBrand._id;
        } else {
            brandID = existingBrand._id;
        }

        if (!existingCategory) {
            const newCategory = new Category({ name: category });
            await newCategory.save();
            categoryID = newCategory._id;
        } else {
            categoryID = existingCategory._id;
        }

        const newProduct = new Watch({
            name,
            stock_quantity,
            brandID,
            price,
            description,
            categoryID,
            images
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    }
};




