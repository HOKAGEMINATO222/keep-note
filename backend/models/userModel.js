const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true }, // Tên người dùng
    name : { type: String, required: true }, // Tên đầy đủ
    email : { type: String, unique: true, sparse: true }, // Email người dùng
    password: { type: String, required: true }, // Mật khẩu người dùng
    profilePicture: { type: String, default: '' }, // Hình ảnh đại diện
}, {
    timestamps: true,  versionKey :false // Tự động thêm trường createdAt và updatedAt
});

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');