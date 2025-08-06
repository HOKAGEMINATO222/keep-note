const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Chạy các quy tắc validation
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Kiểm tra lỗi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

// Quy tắc validation cho đăng ký
const registerValidation = [
  body('userName')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Quy tắc validation cho đăng nhập
const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { validate, registerValidation, loginValidation };