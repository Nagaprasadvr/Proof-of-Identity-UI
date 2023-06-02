"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeypairPath = void 0;
const os_1 = __importDefault(require("os"));
const home = os_1.default.homedir();
const getKeypairPath = () => {
    return `${home}/RSA/keypair.json`;
};
exports.getKeypairPath = getKeypairPath;
