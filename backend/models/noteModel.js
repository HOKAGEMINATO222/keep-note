const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    content: { type: String, required: true},
    isImportant: { type: Boolean, default: false},
    upLoadBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date : { type: Date, default: Date.now },
});

mongoose.model('Note', noteSchema);

module.exports = mongoose.model('Note');