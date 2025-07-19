const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

const db = require("./config/db.js");

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", require("./routes/index.js"));

app.listen(process.env.PORT, (e) => {
  e
    ? console.log(e)
    : console.log("Server is running on port :- ", process.env.PORT);
});
