"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ResponseSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Responses", ResponseSchema);
