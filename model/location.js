const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    long:{
        type :String,
        required: true
    }
},
{
    timestamps: true
});

const location = mongoose.model('location',schema);

module.exports = location;