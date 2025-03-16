const mongoose = require("mongoose");
const multer = require("multer");

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const storage = multer.memoryStorage();

schema.statics.uploadimage = multer({ storage }).single("image");

const allownce = mongoose.model("allownce", schema);

module.exports = allownce;