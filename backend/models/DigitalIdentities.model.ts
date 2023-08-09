import mongoose from "mongoose";

export const identitySchema = new mongoose.Schema(
  {
    userPubkey: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DigitalIdentities", identitySchema);
