const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/staff-tracking");

const db = mongoose.connection;

db.once('open',(e)=>{
    e?console.log(e):console.log("db is connected");
});

module.exports = db;