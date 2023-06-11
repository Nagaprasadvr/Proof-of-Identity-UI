"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SendIdentityRequestSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("DigitalIdentities", SendIdentityRequestSchema);
