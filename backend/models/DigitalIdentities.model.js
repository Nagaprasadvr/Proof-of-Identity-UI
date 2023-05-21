const mongoose = require("mongoose");

const identitySchema = new mongoose.Schema(
  {
    userPubkey: {
      type: String,
      required: true,
      unique: true,
    },
    digitalIdentityPubkey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DigitalIdentities", identitySchema);
