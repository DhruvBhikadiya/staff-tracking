const express = require('express');
const routes = express.Router();
const { registration, login, forgotPassword, verifyotp, changePass, getAllUsers, thumbIn, thumbOut, addOrders, addPayment, getOrders, getPayments, getThumbinData, getThumboutData, trackLocatoin, travellingTimeline, getUserInfo } = require('../controller/user.js');

const thumbIns = require('../model/thumbIns.js');
const thumbOuts = require('../model/thumbOuts.js');
const orders = require('../model/order.js');
const payments = require('../model/payment.js');

const { jwtAuthMiddleware } = require('../config/JWTtoken.js');

routes.get('/', async (req,res) => {
  res.send("Hello from server");
});

// LOGIN
routes.post('/login', login);

// REGISTRATION
routes.post('/registration', registration);

// FORGOT PASSWORD
routes.post('/forgotPassword', forgotPassword);

routes.post('/verifyotp/:email', verifyotp);

routes.put('/changePass/:email', changePass);

// GET ALL USERS
routes.get('/getAllUsers', jwtAuthMiddleware, getAllUsers);

// THUMB IN AND THUMB OUT
routes.post('/thumbin', thumbIns.uploadimage, thumbIn);

routes.get('/getThumbIn', jwtAuthMiddleware, getThumbinData);

routes.post('/thumbout', thumbOuts.uploadimage, thumbOut);

routes.get('/getThumbOut', jwtAuthMiddleware, getThumboutData);

// TRACK LOCATION
routes.post('/trackLocation', jwtAuthMiddleware, trackLocatoin);

// ADD ORDERS
routes.post('/addOrder', orders.uploadimage, addOrders);

routes.get('/getOrders', jwtAuthMiddleware, getOrders);

// ADD PAYMENTS
routes.post('/addPayment', payments.uploadimage, addPayment);

routes.get('/getPaymentsData', jwtAuthMiddleware, getPayments);

// MAP VIEW TO CHECK TRAVELLING TIMELINE
routes.get('/mapView', jwtAuthMiddleware, travellingTimeline);

// TODAY THUMBIN DATA
routes.get('/getUserinfo', jwtAuthMiddleware, getUserInfo);

module.exports = routes;
