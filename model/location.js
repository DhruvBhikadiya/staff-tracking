const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    lat: {
        type: Number,
        required: true
    },
    long:{
        type :Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const location = mongoose.model('location',schema);

module.exports = location;
