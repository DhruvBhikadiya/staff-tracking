const express = require('express');
const routes = express.Router();

const {
    addUser,
    getAllManager,
    getAllUser,
    getOrders,
    getPayments,
    getThumbinData,
    getThumboutData,
    mapView,
    getAllowncewUsers,
    getInOutThumbDetails,
    dashboard,
    getUserLeave,
    updateUserLeave
} = require('../controller/admin.js');

const { jwtAuthMiddleware } = require('../config/JWTtoken.js');

routes.post('/addUser', jwtAuthMiddleware, addUser);

routes.get('/getAllManager', jwtAuthMiddleware, getAllManager);

routes.get('/getAllUser', jwtAuthMiddleware, getAllUser);

routes.get('/getThumbIn', jwtAuthMiddleware, getThumbinData);

routes.get('/getThumbOut', jwtAuthMiddleware, getThumboutData);

routes.get('/getOrders', jwtAuthMiddleware, getOrders);

routes.get('/getPaymentsData', jwtAuthMiddleware, getPayments);

routes.get('/mapView', jwtAuthMiddleware, mapView);

routes.post('/getAllowncewUsers', jwtAuthMiddleware, getAllowncewUsers);

routes.post("/getInOutThumbDetails", jwtAuthMiddleware, getInOutThumbDetails);

routes.get("/dashboard", jwtAuthMiddleware, dashboard);

routes.get("/getUserLeave", jwtAuthMiddleware, getUserLeave);

routes.put("/updateUserLeave", jwtAuthMiddleware, updateUserLeave);

module.exports = routes;
