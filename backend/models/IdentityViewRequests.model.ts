import mongoose from "mongoose";

const identityViewRequestSchema = new mongoose.Schema(
  {
    pubkey: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DigitalIdentities", identityViewRequestSchema);
