const express = require('express');
const routes = express.Router();

routes.use('/api/', require('./user.js'));

module.exports = routes;
