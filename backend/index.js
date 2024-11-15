const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const watchRoutes = require('./routes/watchRoutes');
const brandRoutes = require('./routes/brandRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
//admin
const adminRoutes = require('./routes/adminRoutes')
const categoryRoutes = require('./routes/categoryRoutes');
const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/ChronoVault', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Use the routes
app.use(watchRoutes);
app.use(brandRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/addproduct', watchRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/watches', watchRoutes);
app.use('/api/brands', brandRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));