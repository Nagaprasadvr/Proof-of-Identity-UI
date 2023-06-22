import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    panNum: {
      type: String,
      required: true,
    },
    aadharNum: {
      type: String,
      required: true,
    },
    contactNum: {
      type: String,
      required: true,
    },
    passportNum: {
      type: String,
      required: true,
    },
    picUploadLink: {
      type: String,
      required: true,
    },
    passportUploadLink: {
      type: String,
      required: true,
    },
    panUploadLink: {
      type: String,
      required: true,
    },
    aadharUploadLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Responses", ResponseSchema);
