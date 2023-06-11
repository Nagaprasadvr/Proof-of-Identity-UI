"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DigitalIdentities_model_1 = __importDefault(require("../models/DigitalIdentities.model"));
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
router.route("/get").get((req, res) => {
    DigitalIdentities_model_1.default.find()
        .then((digIds) => res.json(digIds))
        .catch((err) => res.status(400).json("Error:" + err));
});
router.route("/add").post((req, res) => {
    const userPubkey = req.body.userPubkey;
    const name = req.body.name;
    const newdigId = new DigitalIdentities_model_1.default({
        userPubkey: userPubkey,
        name: name
    });
    newdigId
        .save()
        .then(() => {
        res.json("Digital Identity Added!");
    })
        .catch((err) => res.json("Error:" + err));
});
exports.default = router;
