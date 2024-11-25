const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const db = require('./config/db.js');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/', require('./routes/index.js'));

app.listen(process.env.PORT, (e) => {
    e ? console.log(e) : console.log('Server is running on port :- ', process.env.PORT);
});