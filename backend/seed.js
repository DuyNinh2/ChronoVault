const mongoose = require('mongoose');
const Watch = require('./models/Watch');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Review = require('./models/Review');
const User = require('./models/User');
const Admin = require('../models/Admin');
const Promotion = require('./models/Promotion');
const Statistic = require('./models/Statistic');

mongoose.connect('mongodb://localhost:27017/ChronoVault', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));



async function createSampleData() {

  // Tạo dữ liệu mẫu cho Admin
  const admin = new Admin({
    username: 'admin',
    password: '1',
  });

  await admin.save();

  // Tạo dữ liệu mẫu cho Brand
  const brand1 = new Brand({ name: 'Hublot' });
  const brand2 = new Brand({ name: 'Omega' });
  const brand3 = new Brand({ name: 'Mido' });
  const brand4 = new Brand({ name: 'Rolex' });

  await brand1.save();
  await brand2.save();
  await brand3.save();
  await brand4.save();

  // Tạo dữ liệu mẫu cho Category
  const cat1 = new Category({ name: 'Analog' });
  const cat2 = new Category({ name: 'Digital' });
  const cat3 = new Category({ name: 'Mechanical' });
  const cat4 = new Category({ name: 'Mens' });
  const cat5 = new Category({ name: 'Womens' });

  await cat1.save();
  await cat2.save();
  await cat3.save();
  await cat4.save();
  await cat5.save();

  // Tạo dữ liệu mẫu cho Watch
  const watch1 = new Watch({
    name: 'Speedmaster Anniversary Series',
    stock_quantity: 5,
    brandID: brand2._id, // Tham chiếu đến Brand
    price: 150,
    description: 'A stylish classic watch with leather strap',
    category_id: cat1._id,
    images: [
      {
        image_url: '../client/public/images/omega1.jpg',
        alt_text: 'Omega',
      },
      {
        image_url: '../client/public/images/omega2.jpg',
        alt_text: 'Omega',
      },
      {
        image_url: '../client/public/images/omega3.jpg',
        alt_text: 'Omega',
      },
    ],
  });


  await watch1.save();


  // Tạo dữ liệu mẫu cho User
  const user1 = new User({
    userName: 'duyninh',
    password: '1234',
    email: 'duy@gmail.com',
    phone: 12334567890,
    address: [
      {
        street: 'Nguyen Van Luong',
        city: 'Ho Chi Minh',
        district: 'Go Vap',
        country: 'Vietnam',
      },
    ],
  });


  await user1.save();


  console.log('Sample data created');
  mongoose.connection.close();
}

createSampleData();
