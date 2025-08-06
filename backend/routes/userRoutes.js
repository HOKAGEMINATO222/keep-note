const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile, changePassword, getUserDetails } = require('../controllers/userController');
const { validate, registerValidation, loginValidation } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Đăng ký người dùng
router.post('/signUp', validate(registerValidation), registerUser);

// Đăng nhập người dùng
router.post('/login', validate(loginValidation), loginUser);


router.get('/getUserDetails', protect, getUserDetails);


module.exports = router;