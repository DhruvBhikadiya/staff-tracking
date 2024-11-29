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
    phone:{
        type :String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true
});

const user = mongoose.model('user',schema);

module.exports = user;