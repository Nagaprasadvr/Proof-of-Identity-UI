"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RequestSchema = new mongoose_1.default.Schema({
    solPubkey: {
        type: String,
        required: true,
        unique: true,
    },
    rsaPubkey: {
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Requests", RequestSchema);
