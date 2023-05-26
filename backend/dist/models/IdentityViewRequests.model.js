"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const identityViewRequestSchema = new mongoose_1.default.Schema({
    pubKey: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    digitalIdentityPubkey: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("DigitalIdentities", identityViewRequestSchema);
