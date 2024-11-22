const Cart = require('../models/Cart'); 

// Thêm sản phẩm vào giỏ hàng
exports.addItemToCart = async (req, res) => {
  const { userID, watchID, quantity } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!userID || !watchID || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid data. Please provide userID, watchID, and valid quantity.' });
  }

  try {
    // Kiểm tra xem giỏ hàng của người dùng đã tồn tại chưa
    let cart = await Cart.findOne({ userID });

    if (!cart) {
      // Nếu chưa có giỏ hàng, tạo mới
      cart = new Cart({ userID, items: [{ watchID, quantity }] });
    } else {
      // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
      const itemIndex = cart.items.findIndex(item => item.watchID.toString() === watchID);

      if (itemIndex > -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Nếu không, thêm sản phẩm mới
        cart.items.push({ watchID, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({ message: 'Error adding item to cart', error: err.message });
  }
};
