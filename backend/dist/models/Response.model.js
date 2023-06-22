"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ResponseSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Responses", ResponseSchema);
