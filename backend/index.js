const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

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
const paymentRoutes = require('./routes/paymentRoutes');
const orderController = require('./controllers/orderController');

const app = express();
const path = require('path');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Example event listener for order notifications
  socket.on('newOrderNotification', (count) => {
    console.log('New order notification:', count);
    io.emit('newOrderNotification', count); // Emit event to all connected clients
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

orderController.setSocketIo(io);  // Đặt sau khi khởi tạo WebSocket

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
app.use('/api/payments', paymentRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/statistic', statisticRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
