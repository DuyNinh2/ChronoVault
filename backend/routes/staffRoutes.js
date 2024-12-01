const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { verifyToken } = require("../controllers/authMiddleware");

// Routes liên quan đến Staff
router.post("/login", staffController.loginStaff); // Không cần verifyToken
router.get("/getAssignedOrders", verifyToken, staffController.getAssignedOrders);
router.patch("/updateOrderStatus", verifyToken, staffController.updateOrderStatus);
router.get("/getAllStaff", verifyToken, staffController.getAllStaff);


module.exports = router; // Export router
