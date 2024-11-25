const mongoose = require('mongoose');

const schema = mongoose.Schema({
    otp: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60
    }
});

const otp = mongoose.model('otp', schema);

module.exports = otp;