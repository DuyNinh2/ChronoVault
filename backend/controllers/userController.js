const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: 'Thông tin không được để trống!' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không đúng định dạng!' });
    }

    // const phoneRegex = /^\d{10}$/;
    // if (!phoneRegex.test(phone)) {
    //   return res.status(400).json({ message: 'Số điện thoại chỉ được có 10 số!' });
    // }

    console.log("Tìm người dùng với:", { username, email });
    const user = await User.findOne({ username, email });
    console.log("Người dùng tìm thấy:", user);

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

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userSettings = {
      email: user.email,
      phoneNumber: user.phone,
      dateOfBirth: user.dateOfBirth,
      address: user.address || [], // Trả về toàn bộ danh sách địa chỉ
    };

    res.status(200).json(userSettings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Failed to fetch user settings' });
  }
};


// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const userID = req.params.id;
    const { phoneNumber, dateOfBirth, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        phone: phoneNumber,
        dateOfBirth,
        address: address, // Lưu toàn bộ danh sách địa chỉ
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Settings updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ message: 'Failed to update user settings' });
  }
};


exports.addAddress = async (req, res) => {
  const { userID } = req.params;
  const { street, city, district, country } = req.body;

  if (!street || !city || !district || !country) {
    return res.status(400).json({ message: "All address fields are required." });
  }

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newAddress = { street, city, district, country };
    user.address.push(newAddress);

    await user.save();

    res.status(200).json({ message: "Address added successfully.", address: user.address });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Failed to add address.", error });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { userID, addressID } = req.params;

    // Tìm user và cập nhật mảng address bằng cách loại bỏ địa chỉ
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $pull: { address: { _id: addressID } } }, // Xóa địa chỉ dựa trên _id
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Address deleted successfully", updatedUser });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userID } = req.params;
    const { currentPassword, newPassword } = req.body;

    // 1. Tìm user từ database
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Kiểm tra Current Password
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 3. Kiểm tra New Password có trùng Current Password không
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password cannot be the same as current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};


