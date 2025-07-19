const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    role: {
        type: String,
        required: true,
        default: 'User'
    }
}, {
    timestamps: true
});

const user = mongoose.model('users', schema);

module.exports = user;