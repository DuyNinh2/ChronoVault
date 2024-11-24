// authMiddleware.js
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Không có token" });
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY"); // Thay thế bằng SECRET_KEY thực tế
        req.user = decoded; // Thêm thông tin user vào request
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};
