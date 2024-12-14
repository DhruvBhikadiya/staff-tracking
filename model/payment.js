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
  amount: {
    type: Number,
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
  },
});

const storage = multer.memoryStorage();

schema.statics.uploadimage = multer({ storage }).single("image");

const payments = mongoose.model("payment", schema);

module.exports = payments;
