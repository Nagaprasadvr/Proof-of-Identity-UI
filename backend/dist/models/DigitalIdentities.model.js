"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identitySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.identitySchema = new mongoose_1.default.Schema({
    userPubkey: {
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
exports.default = mongoose_1.default.model("DigitalIdentities", exports.identitySchema);
