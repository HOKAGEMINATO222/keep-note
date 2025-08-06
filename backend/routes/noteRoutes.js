const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote, editNote, getNotesById } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');


router.get('/getNotes', protect, getNotes); // Lấy danh sách ghi chú
router.post('/addNote', protect,  createNote); // Tạo ghi chú mới
router.get('/notes/:id', protect, getNotesById); // Lấy ghi chú theo ID
router.put('/notes/:id', protect, editNote); // Cập nhật ghi chú theo ID
router.delete('/notes/:id', protect, deleteNote); // Xóa ghi chú theo ID

module.exports = router;