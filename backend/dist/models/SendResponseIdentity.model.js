"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SendIdentityRequestSchema = new mongoose_1.default.Schema({
    pubkey: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: String,
        required: true,
        unique: true,
    },
    panNum: {
        type: String,
        required: true,
        unique: true,
    },
    aadharNum: {
        type: String,
        required: true,
        unique: true,
    },
    passportNum: {
        type: String,
        required: true,
        unique: true,
    },
    pic: {
        type: String,
        required: true,
        unique: true,
    },
    passportUploadLink: {
        type: String,
        required: true,
        unique: true,
    },
    panUploadLink: {
        type: String,
        required: true,
        unique: true,
    },
    aadharUploadLink: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("DigitalIdentities", SendIdentityRequestSchema);
