import mongoose from "mongoose";

const SendIdentityRequestSchema = new mongoose.Schema(
  {
    pubkey: {
      type: String,
          required: false,
          unique: true,
        },
        senderName: {
            type: String,
            required: true,
    },
    name: {
      type: Boolean,
      required: false,
              },
    dob: {
      type: Boolean,
      required: false,
              },
    panNum: {
      type: Boolean,
      required: false,
              },
    aadharNum: {
      type: Boolean,
      required: false,
              },
    passportNum: {
      type: Boolean,
      required: false,
              },
    pic: {
      type: Boolean,
      required: false,
              },
    passportUploadLink: {
      type: Boolean,
      required: false,
              },
    panUploadLink: {
      type: Boolean,
      required: false,
              },
    aadharUploadLink: {
      type: Boolean,
      required: false,
              },
    description: {
      type: Boolean,
      required: false,
              },
        
    },
  {
    timestamps: true,
  }
);

export default mongoose.model("DigitalIdentities", SendIdentityRequestSchema);
