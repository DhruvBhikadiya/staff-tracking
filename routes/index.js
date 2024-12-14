const express = require("express");
const routes = express.Router();

routes.use("/api/", require("./user.js"));
routes.use("/api/admin", require("./admin.js"));

module.exports = routes;
