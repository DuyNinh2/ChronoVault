const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["Shipper"], required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);
