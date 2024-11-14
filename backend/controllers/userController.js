const User = require('../models/User');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Số điện thoại đã được sử dụng!' });
        }
        const newUser = new User({
            username,
            email,
            phone,
            password,
        });

        // Lưu người dùng vào MongoDB
        await newUser.save();

        // Trả về phản hồi thành công
        res.status(201).json({ message: 'Tài khoản được tạo thành công!', user: newUser });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Đăng ký không thành công, vui lòng thử lại.', error });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(402).json({ message: 'Thông tin xác thực không hợp lệ' });
        }
        res.status(402).json({ message: 'Đăng nhập thành công', user });
    } catch (error) {
        res.status(500).json({ message: 'Đăng nhập không thành công', error });
    }
};

// controllers/userController.js

exports.forgotPassword = async (req, res) => {
    try {
        const { username, phone, email } = req.body;

        if (!username || !phone || !email) {
            return res.status(400).json({ message: 'Thông tin không được để trống!' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email không đúng định dạng!' });
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Số điện thoại chỉ được có 10 số!' });
        }

        const user = await User.findOne({ username, email, phone });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với thông tin này.' });
        }

        // Kiểm tra xem có tìm thấy người dùng không
        console.log("User found:", user);

        // Thiết lập lại mật khẩu
        user.password = "1";

        // Lưu thay đổi và log kết quả
        const updatedUser = await user.save();
        console.log("Updated user:", updatedUser);

        res.status(200).json({ message: 'Đã cấp lại mật khẩu thành công. Vui lòng kiểm tra email!' });
    } catch (error) {
        console.error("Error during forgot password process:", error);
        res.status(500).json({ message: 'Xử lý yêu cầu quên mật khẩu không thành công.', error });
    }
};

// Xu ly ben Admin: quan ly thong tin User
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Lấy tất cả user từ MongoDB
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu người dùng.', error });
    }
};
