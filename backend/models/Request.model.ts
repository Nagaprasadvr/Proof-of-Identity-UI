import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    solPubkey: {
      type: String,
      required: true,
    },
    rsaPubkey512: {
      type: String,
      required: true,
    },
    rsaPubkey1028: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    requestedSolPubkey: {
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
    contactNum: {
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
    state: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Requests", RequestSchema);
