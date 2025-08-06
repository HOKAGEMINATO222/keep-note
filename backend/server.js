require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

const corsOptions = {
    origin: ['http://localhost:5173'],  
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Kết nối đến MongoDB Atlas
connectDB();

// Khởi tạo ứng dụng Express
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// Sử dụng routes người dùng
app.use('/', userRoutes);

// Sử dụng routes ghi chú
app.use('/', noteRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));