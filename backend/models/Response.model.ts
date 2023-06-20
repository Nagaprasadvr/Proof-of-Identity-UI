import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      unique: true,
    },
    dob: {
      type: String,
      unique: true,
    },
    panNum: {
      type: String,
      unique: true,
    },
    aadharNum: {
      type: String,
      unique: true,
    },
    passportNum: {
      type: String,
      unique: true,
    },
    picUploadLink: {
      type: String,
      unique: true,
    },
    passportUploadLink: {
      type: String,
      unique: true,
    },
    panUploadLink: {
      type: String,
      unique: true,
    },
    aadharUploadLink: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Responses", ResponseSchema);
