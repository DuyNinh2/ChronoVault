const Cart = require('../models/Cart');
const Watch = require('../models/Watch');

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


exports.getCartItems = async (req, res) => {
  const { userID } = req.body; // Lấy userID từ request body

  if (!userID) {
    return res.status(400).json({ message: 'Invalid data. Please provide userID' });
  }

  try {
    // Tìm giỏ hàng dựa trên userID
    const cart = await Cart.findOne({ userID });

    if (!cart) {
      console.log('Cart not found for userID:', userID);
      return res.status(200).json({ cartItems: [] }); // Trả về giỏ hàng rỗng nếu không tồn tại
    }

    // Lấy thông tin chi tiết của từng sản phẩm trong giỏ hàng
    const cartItems = await Promise.all(cart.items.map(async (item) => {
      const watch = await Watch.findById(item.watchID); // Lấy thông tin sản phẩm từ Watch model

      // Nếu không tìm thấy sản phẩm, bỏ qua
      if (!watch) return null;

      return {
        _id: item._id,
        watchId: item.watchID,
        quantity: item.quantity,
        product: {
          name: watch.name,
          stock_quantity: watch.stock_quantity,
          price: watch.price,
          image: watch.images[0]?.image_url || '', // Lấy hình ảnh đầu tiên hoặc để trống nếu không có
        },
      };
    }));

    // Loại bỏ các mục null (sản phẩm không tồn tại)
    res.json({ cartItems: cartItems.filter(item => item !== null) });
  } catch (error) {
    console.error('Error in getCartItems:', error);
    res.status(500).json({ message: 'An error occurred while retrieving cart items.' });
  }
};


// Update product quantity in cart
exports.updateCartQuantity = async (req, res) => {
  const { userID, watchID, quantity } = req.body;

  if (!userID || !watchID || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid data. Please provide valid userID, watchID, and quantity.' });
  }

  try {
    const cart = await Cart.findOne({ userID });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(item => item.watchID.toString() === watchID);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    const watch = await Watch.findById(watchID);
    if (!watch) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (quantity > watch.stock_quantity) {
      return res.status(400).json({ message: 'Quantity exceeds stock availability.' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully.', cart });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ message: 'Error updating cart quantity.', error: error.message });
  }
};


// Remove item from cart
exports.removeCartItem = async (req, res) => {
  const { userID, watchID } = req.body;

  if (!userID || !watchID) {
    return res.status(400).json({ message: 'Invalid data. Please provide valid userID and watchID.' });
  }

  try {
    const cart = await Cart.findOne({ userID });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(item => item.watchID.toString() !== watchID);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart successfully.', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart.', error: error.message });
  }
};


exports.clearCartItems = (req, res) => {
  const { userID } = req.params;

  Cart.findOneAndDelete({ userID })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(500).json({ error: 'Error clearing cart' }));
};







