const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    client_name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const newUser = mongoose.model('newUser', schema);

module.exports = newUser;