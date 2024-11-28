const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long:{
        type :Number,
        required: true
    }
},
{
    timestamps: true
});

const location = mongoose.model('location',schema);

module.exports = location;
