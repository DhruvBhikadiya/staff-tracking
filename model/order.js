const mongoose = require("mongoose");
const multer = require("multer");

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
  },
});

const storage = multer.memoryStorage();

schema.statics.uploadimage = multer({ storage }).single("image");

const orders = mongoose.model("order", schema);

module.exports = orders;
