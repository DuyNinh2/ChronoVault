const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const watchRoutes = require('./routes/watchRoutes');
const brandRoutes = require('./routes/brandRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const staffRoutes = require('./routes/staffRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const statisticRoutes = require('./routes/statisticRoutes');
const app = express();
const path = require('path');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/ChronoVault', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Use the routes
app.use(watchRoutes);
app.use(brandRoutes);
app.use(categoryRoutes);
app.use(cartRoutes);
app.use(promotionRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/statistic', statisticRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
