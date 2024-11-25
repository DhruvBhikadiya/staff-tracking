const mongoose = require('mongoose');
const multer = require('multer');

const schema = mongoose.Schema({
    km: {
        type: Number,
        required: true
    },
    inDate: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String, // Store image as base64
        required: true
    }
});

// Define multer storage in memory instead of on disk
const storage = multer.memoryStorage();

schema.statics.uploadimage = multer({ storage }).single('image'); // Use multer's in-memory storage

const thumbIns = mongoose.model('thumbins', schema);

module.exports = thumbIns;