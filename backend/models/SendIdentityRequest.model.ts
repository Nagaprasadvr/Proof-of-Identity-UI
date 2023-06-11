import mongoose from "mongoose";

const SendIdentityRequestSchema = new mongoose.Schema(
  {
    pubkey: {
      type: String,
      required: true,
      unique: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    name: {
      type: Boolean,
      required: true,
    },
    address: {
      type: Boolean,
      required: true,
    },
    dob: {
      type: Boolean,
      required: true,
    },
    panNum: {
      type: Boolean,
      required: true,
    },
    aadharNum: {
      type: Boolean,
      required: true,
    },
    passportNum: {
      type: Boolean,
      required: true,
    },
    picUploadLink: {
      type: Boolean,
      required: true,
    },
    passportUploadLink: {
      type: Boolean,
      required: true,
    },
    panUploadLink: {
      type: Boolean,
      required: true,
    },
    aadharUploadLink: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("IdentityRequests", SendIdentityRequestSchema);
