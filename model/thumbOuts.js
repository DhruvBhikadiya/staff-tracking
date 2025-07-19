const mongoose = require('mongoose');
const multer = require('multer');

const schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    km: {
        type: Number,
        required: true
    },
    outDate: {
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

const thumbOuts = mongoose.model('thumbouts', schema);

module.exports = thumbOuts;
