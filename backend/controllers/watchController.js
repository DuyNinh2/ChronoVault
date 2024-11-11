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


