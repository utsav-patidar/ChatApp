const mongoose = require("mongoose");

const deviceTokenModel = mongoose.Schema(
  {
    token: { type: String, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const DeviceToken = mongoose.model("deviceToken", deviceTokenModel);

module.exports = DeviceToken;
