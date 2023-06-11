"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendIdentityRequest_model_1 = __importDefault(require("../models/SendIdentityRequest.model"));
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
router.route("/send").post((req, res) => {
    const userPubkey = req.body.userPubkey;
    const senderName = req.body.senderName;
    const name = req.body.requestData.name;
    const dob = req.body.requestData.dob;
    const aadharNumber = req.body.requestData.aadharNumber;
    const panNumber = req.body.requestData.panNumber;
    const passportNumber = req.body.requestData.passportNumber;
    const panUploadLink = req.body.requestData.panUploadLink;
    const passportUploadLink = req.body.requestData.passportUploadLink;
    const aadharUploadLink = req.body.requestData.aadharUploadLink;
    const picUploadLink = req.body.requestData.picUploadLink;
    const description = req.body.requestData.description;
    const address = req.body.requestData.address;
    console.log("req data", req.body.requestData);
    const newRequest = new SendIdentityRequest_model_1.default({
        pubkey: userPubkey,
        senderName: senderName,
        name: name,
        dob: dob,
        aadharNum: aadharNumber,
        panNum: panNumber,
        passportNum: passportNumber,
        panUploadLink: panUploadLink,
        passportUploadLink: passportUploadLink,
        aadharUploadLink: aadharUploadLink,
        pic: picUploadLink,
        description: description,
        address: address,
    });
    newRequest
        .save()
        .then(() => {
        res.json("the requests has been sent");
    })
        .catch((err) => res.json("Error:" + err));
});
exports.default = router;
