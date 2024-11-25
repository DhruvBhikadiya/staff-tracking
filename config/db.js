const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

db.once('open',(e)=>{
    e?console.log(e):console.log("db is connected");
});

module.exports = db;
