"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    const rsaPubkey512 = req.body.rsaPubkey512;
    const rsaPubkey1028 = req.body.rsaPubkey1028;
    const contactNum = req.body.requestData.contactNum;
    const newRequest = new Request_model_1.default({
        solPubkey: userPubkey,
        rsaPubkey512: rsaPubkey512,
        rsaPubkey1028: rsaPubkey1028,
        requestedSolPubkey: senderPubkey,
        senderName: senderName,
        name: name,
        dob: dob,
        contactNum: contactNum,
        aadharNum: aadharNumber,
        panNum: panNumber,
        passportNum: passportNumber,
        panUploadLink: panUploadLink,
        passportUploadLink: passportUploadLink,
        aadharUploadLink: aadharUploadLink,
        picUploadLink: picUploadLink,
        description: description,
        address: address,
        state: "Requested",
    });
    newRequest
        .save()
        .then((result) => {
        console.log("Request sent");
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
    const name = req.body.encUserData.name;
    const dob = req.body.encUserData.dob;
    const aadharNumber = req.body.encUserData.aadharNumber;
    const panNumber = req.body.encUserData.panNumber;
    const passportNumber = req.body.encUserData.passportId;
    const panUploadLink = req.body.encArweaveData.panUploadLink;
    const passportUploadLink = req.body.encArweaveData.passportUploadLink;
    const aadharUploadLink = req.body.encArweaveData.aadharUploadLink;
    const picUploadLink = req.body.encArweaveData.picUploadLink;
    const address = req.body.encUserData.residenceAddress;
    console.log("address", address);
    const contactNum = req.body.encUserData.contactNumber;
    console.log("requestId", req.body);
    const newResponse = new Response_model_1.default({
        requestId: requestId,
        name: name,
        dob: dob,
        residenceAddress: address,
        aadharNum: aadharNumber,
        contactNum: contactNum,
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
        res.json({ message: "the response has been sent", status: true });
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
    })
        .catch((err) => res.json("Error:" + err));
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
router.route("/delete").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        // Perform deletion logic here using the provided ID
        yield Request_model_1.default.deleteOne({ _id: id });
        console.log(`Deleting request with ID: ${id}`);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}));
router.route("/cancel").post((req, res) => {
    const id = req.body.id;
    Request_model_1.default.updateOne({
        _id: new mongodb_1.ObjectId(id),
    }, {
        $set: {
            state: "Cancelled",
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
router.route("/getResponseById").post((req, res) => {
    const id = req.body.id;
    console.log(id);
    Response_model_1.default.find({ requestId: id })
        .then((response) => res.json(response))
        .catch((err) => console.log(err));
});
exports.default = router;
