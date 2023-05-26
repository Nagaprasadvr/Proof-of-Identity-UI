import { Mongoose } from "mongoose";

import mongoose from "mongoose";

export const identitySchema = new mongoose.Schema(
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

export default mongoose.model("DigitalIdentities", identitySchema);
