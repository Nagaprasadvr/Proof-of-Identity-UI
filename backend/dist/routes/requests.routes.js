"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_model_1 = __importDefault(require("../models/Request.model"));
const express_1 = __importDefault(require("express"));
const Response_model_1 = __importDefault(require("../models/Response.model"));
const mongodb_1 = require("mongodb");
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
    const senderPubkey = req.body.requestedSolPubkey;
    const rsaPubkey = req.body.rsaPubkey;
    const newRequest = new Request_model_1.default({
        solPubkey: userPubkey,
        rsaPubkey: rsaPubkey,
        requestedSolPubkey: senderPubkey,
        senderName: senderName,
        name: name,
        dob: dob,
        aadharNum: aadharNumber,
        panNum: panNumber,
        passportNum: passportNumber,
        panUploadLink: panUploadLink,
        passportUploadLink: passportUploadLink,
        aadharUploadLink: aadharUploadLink,
        picUploadLink: picUploadLink,
        description: description,
        address: address,
        state: 'Requested'
    });
    newRequest
        .save()
        .then(() => {
        res.json("the requests has been sent");
    })
        .catch((err) => res.json("Error:" + err));
});
router.route("/getAll").get((req, res) => {
    Request_model_1.default.find()
        .then((SendRequest) => res.json(SendRequest))
        .catch((err) => res.status(400).json("Error:" + err));
});
router.route("/get").post((req, res) => {
    const id = req.body.id;
    Request_model_1.default.findById(id)
        .then((response) => {
        res.json({ data: response });
    })
        .catch((err) => console.log(err));
});
router.route("/approve").post((req, res) => {
    const requestId = req.body.requestId;
    const name = req.body.requestData.name;
    const dob = req.body.requestData.dob;
    const aadharNumber = req.body.requestData.aadharNumber;
    const panNumber = req.body.requestData.panNumber;
    const passportNumber = req.body.requestData.passportNumber;
    const panUploadLink = req.body.requestData.panUploadLink;
    const passportUploadLink = req.body.requestData.passportUploadLink;
    const aadharUploadLink = req.body.requestData.aadharUploadLink;
    const picUploadLink = req.body.requestData.picUploadLink;
    const address = req.body.requestData.address;
    const newResponse = new Response_model_1.default({
        requestId: requestId,
        name: name,
        dob: dob,
        address: address,
        aadharNum: aadharNumber,
        panNum: panNumber,
        passportNum: passportNumber,
        picUploadLink: picUploadLink,
        panUploadLink: panUploadLink,
        passportUploadLink: passportUploadLink,
        aadharUploadLink: aadharUploadLink,
    });
    newResponse
        .save()
        .then(() => {
        res.json("the requests has been sent");
    })
        .catch((err) => res.json("Error:" + err));
    Request_model_1.default.updateOne({
        _id: new mongodb_1.ObjectId(requestId),
    }, {
        $set: {
            state: "Approved",
        },
    }, null, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        else {
            console.log("update success");
        }
    });
});
router.route("/deny").post((req, res) => {
    const id = req.body.id;
    Request_model_1.default.updateOne({
        _id: new mongodb_1.ObjectId(id),
    }, {
        $set: {
            state: "Denied",
        },
    }, null, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        else {
            console.log("update success");
        }
    });
});
exports.default = router;
