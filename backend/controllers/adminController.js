// routes/adminRoutes.js
const Admin = require('../models/admin');

// Register a new admin with fixed credentials
exports.registerAdmin = async (req, res) => {
    try {
        // Check if an admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already registered' });
        }

        // Create admin with fixed credentials
        const newAdmin = new Admin({ username: 'admin', password: '1' });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully with default credentials' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering admin', error });
    }
};

// Admin login
exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === 'admin' && password === '1') {
            const admin = await Admin.findOne({ username: 'admin', password: '1' });
            if (admin) {
                res.status(200).json({ message: 'Login successful', admin });
            } else {
                res.status(401).json({ message: 'Admin not found, please register' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

