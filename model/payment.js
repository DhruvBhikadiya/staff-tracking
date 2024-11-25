const mongoose = require('mongoose');
const multer = require('multer');

const schema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    client_name: {
        type: String,
        required: true
    },
});

const storage = multer.memoryStorage();

schema.statics.uploadimage = multer({ storage }).single('image');

const payments = mongoose.model('payment', schema);

module.exports = payments;