const express = require("express");
const routes = express.Router();
const {
  registration,
  login,
  forgotPassword,
  verifyotp,
  changePass,
  thumbIn,
  thumbOut,
  addOrders,
  addPayment,
  trackLocation,
  getUserInfo,
  getClientByUser,
  getallownce,
  getInOutThumbDetails
} = require("../controller/user.js");

const thumbIns = require("../model/thumbIns.js");
const thumbOuts = require("../model/thumbOuts.js");
const orders = require("../model/order.js");
const payments = require("../model/payment.js");
const allownce = require("../model/allownce.js");

const { jwtAuthMiddleware } = require("../config/JWTtoken.js");

routes.get("/", async (req, res) => {
  res.send("Hello from server");
});

// LOGIN
routes.post("/login", login);

// REGISTRATION
routes.post("/registration", registration);

// FORGOT PASSWORD
routes.post("/forgotPassword", forgotPassword);

routes.post("/verifyotp/:email", verifyotp);

routes.put("/changePass/:email", changePass);

// THUMB IN AND THUMB OUT
routes.post("/thumbin", jwtAuthMiddleware, thumbIns.uploadimage, thumbIn);

routes.post("/thumbout", jwtAuthMiddleware, thumbOuts.uploadimage, thumbOut);

// TRACK LOCATION
routes.post("/trackLocation", jwtAuthMiddleware, trackLocation);

// ADD ORDERS
routes.post("/addOrder", jwtAuthMiddleware, orders.uploadimage, addOrders);

// ADD PAYMENTS
routes.post("/addPayment", jwtAuthMiddleware, payments.uploadimage, addPayment);

// TODAY THUMBIN DATA
routes.get("/getUserinfo", jwtAuthMiddleware, getUserInfo);

routes.get("/getClientByUser", jwtAuthMiddleware, getClientByUser);

// GET ALLOWANCE
routes.post("/allownce", jwtAuthMiddleware, allownce.uploadimage, getallownce);

// GET IN OUT THUMB DETAILS
routes.get("/getInOutThumbDetails", jwtAuthMiddleware, getInOutThumbDetails)

module.exports = routes;
