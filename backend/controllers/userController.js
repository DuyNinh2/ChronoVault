const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(400).json({ message: 'Username đã được sử dụng!' });
        }

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

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }

        // So sánh mật khẩu
        if (password !== user.password) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user._id.toString(), username: user.username },
            'jwtsecret',
            { expiresIn: '1h' }
        );

        // Trả về token và thông tin người dùng
        res.status(200).json({
            token,
            username: user.username,
            userId: user._id.toString(),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ!' });
    }
};

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

// Get user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

exports.saveUserAddress = (req, res) => { 
    const { userID } = req.params; 
    const { street, city, district, country } = req.body; 
    User.findByIdAndUpdate(userID, { $push: { address: { street, city, district, country } } }, { new: true }) 
        .then(user => res.json(user)) 
        .catch(err => res.status(500).json({ error: 'Error saving address' })); 
};

//Lấy danh sách wishlist
exports.getWishlist = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate("wishlist");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.json(user.wishlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

