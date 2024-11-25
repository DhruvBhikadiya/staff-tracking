const express = require('express');
const routes = express.Router();

routes.use('/', require('./user.js'));

module.exports = routes;