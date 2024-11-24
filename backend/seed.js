const mongoose = require('mongoose');
const Watch = require('./models/Watch');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Review = require('./models/Review');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Promotion = require('./models/Promotion');
const Statistic = require('./models/Statistic');
const Staff = require('./models/Staff');

mongoose.connect('mongodb://localhost:27017/ChronoVault', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));



async function createSampleData() {

  // // Tạo dữ liệu mẫu cho Admin
  // const admin = new Admin({
  //   username: 'admin',
  //   password: '1',
  // });

  //   await admin.save();

  // const staff = new Staff({
  //   username: 'VanC',
  //   name: 'Le Van C',
  //   password: '13',
  //   phone: '0901264567',
  //   role: 'Shipper',
  // });
  // const savedStaff = await staff.save();

  // Tạo dữ liệu Order
  const order = new Order({
    userID: '64f3a3b6e92e1b001234dcba', // Thay thế bằng ObjectId hợp lệ từ User
    status: 'Pending',
    total_amount: 2000,
    order_date: new Date(),
    items: [
      {
        watchID: '64f3a3b6e92e1b0012349999', // Thay thế bằng ObjectId hợp lệ từ Watch
        quantity: 1,
        price: 2000,
      },
      {
        watchID: '64f3a3b6e92e1b0012349989', // Thay thế bằng ObjectId hợp lệ từ Watch
        quantity: 2,
        price: 2000,
      },
    ],
  });

  await order.save();
  // Tạo dữ liệu mẫu cho Brand
  // const brand1 = new Brand({ name: 'Hublot' });
  // const brand2 = new Brand({ name: 'Omega' });


  // await brand1.save();
  // await brand2.save();


  //   // Tạo dữ liệu mẫu cho Category
  //   const cat1 = new Category({ name: 'Analog' });
  //   const cat2 = new Category({ name: 'Digital' });
  //   const cat3 = new Category({ name: 'Mechanical' });
  // const cat4 = new Category({ name: 'Mens' });
  // const cat5 = new Category({ name: 'Womens' });

  //   await cat1.save();
  //   await cat2.save();
  //   await cat3.save();
  // await cat4.save();
  // await cat5.save();

  // // Tạo dữ liệu mẫu cho Watch
  // const watch1 = new Watch({
  //   name: 'Speedmaster Anniversary Series',
  //   stock_quantity: 5,
  //   brandID: brand2,
  //   price: 150,
  //   description: 'A stylish classic watch with leather strap',
  //   category_id: cat5,
  //   images: [
  //     {
  //       image_url: '/images/DeVille1.jpg',
  //       alt_text: 'casio',
  //     },
  //     {
  //       image_url: '/images/DeVille2.jpg',
  //       alt_text: 'casio',
  //     },
  //     {
  //       image_url: '/images/DeVille3.jpg',
  //       alt_text: 'casio',
  //     },
  //   ],
  // });


  // await watch2.save();
  // await watch3.save();


  // // Tạo dữ liệu mẫu cho User
  // const user = new User({
  //   userName: 'duyninh',
  //   password: '1234',
  //   email: 'duy@gmail.com',
  //   phone: 12334567890,
  //   address: [
  //     {
  //       street: 'Nguyen Van Luong',
  //       city: 'Ho Chi Minh',
  //       district: 'Go Vap',
  //       country: 'Vietnam',
  //     },
  //   ],
  // });


  // await user.save();


  console.log('Sample data created');
  mongoose.connection.close();
}

createSampleData();
