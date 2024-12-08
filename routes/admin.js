const express = require('express');
const routes = express.Router();

const {
    getAllUsers,
    getOrders,
    getPayments,
    getThumbinData,
    getThumboutData,
    mapView
} = require('../controller/admin.js');

const { jwtAuthMiddleware } = require('../config/JWTtoken.js');

routes.get('/getAllUsers', jwtAuthMiddleware, getAllUsers);

routes.get('/getThumbIn', jwtAuthMiddleware, getThumbinData);

routes.get('/getThumbOut', jwtAuthMiddleware, getThumboutData);

routes.get('/getOrders', jwtAuthMiddleware, getOrders);

routes.get('/getPaymentsData', jwtAuthMiddleware, getPayments);

routes.get('/mapView', jwtAuthMiddleware, mapView);

module.exports = routes;
