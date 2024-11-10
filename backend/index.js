const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/watchRoutes');

const app = express();

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/ChronoVault', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.json());

// Routes
app.use('/api', productRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to ChronoVault API!');
});

// Khởi động server
app.listen(3000, () => console.log('Server is running on port 3000'));
