const Note = require('../models/noteModel');

// Lấy danh sách ghi chú
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ upLoadBy: req.user._id });
        const user = {
            name: req.user.name,
            userName: req.user.userName,
        };
        res.status(200).json({ success: true, notes, user });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const getNotesById = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        if (note.upLoadBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this note' });
        }   
        res.status(200).json({ success: true, note });
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}


// Tạo ghi chú mới
const createNote = async (req, res) => {
    try {
        const { title, description, content, isImportant  } = req.body;

        const newNote = new Note({
            title,  
            description,
            content,
            isImportant,
            upLoadBy: req.user._id 
        });

        await newNote.save();
        res.status(201).json({ success: true, note: newNote });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Xoa ghi chú theo ID
const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        if (note.upLoadBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this note' });
        }
        await Note.findByIdAndDelete(noteId);
        res.status(200).json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Chỉnh sửa ghi chú theo ID
const editNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, description, content, isImportant } = req.body;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        if (note.upLoadBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this note' });
        }
        note.title = title;
        note.description = description;
        note.content = content;
        note.isImportant = isImportant;
        await note.save();
        res.status(200).json({ success: true, note });
    } catch (error) {
        console.error('Error editing note:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}


module.exports = { getNotes, createNote, deleteNote, editNote, getNotesById};