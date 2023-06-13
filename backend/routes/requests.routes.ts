import { Request, Response, response } from "express";
import SendRequest from "../models/SendIdentityRequest.model";
import express from "express";
import { request } from "http";
const router = express();

router.route("/send").post((req: Request, res: Response) => {
  console.log("Sender Name: " + req.body.requestData.senderName);
  console.log("pubkey:" + req.body.userPubkey);
  console.log("data:" + JSON.stringify(req.body.requestData));
  console.log("RequestedPubkey: " + req.body.requestedPubkey);

  const userPubkey: string = req.body.userPubkey;
  const senderName: string = req.body.senderName;
  const name: boolean = req.body.requestData.name;
  const dob: boolean = req.body.requestData.dob;
  const aadharNumber: boolean = req.body.requestData.aadharNumber;
  const panNumber: boolean = req.body.requestData.panNumber;
  const passportNumber: boolean = req.body.requestData.passportNumber;
  const panUploadLink: boolean = req.body.requestData.panUploadLink;
  const passportUploadLink: boolean = req.body.requestData.passportUploadLink;
  const aadharUploadLink: boolean = req.body.requestData.aadharUploadLink;
  const picUploadLink: boolean = req.body.requestData.picUploadLink;
  const description: String = req.body.requestData.description;
  const address: boolean = req.body.requestData.address;
  const senderPubkey: string = req.body.requestedPubkey;
  // console.log("req data", req.body.requestData);
  const newRequest = new SendRequest({
    pubkey: userPubkey,
    requestedPubkey: senderPubkey,
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
  });

  newRequest
    .save()
    .then(() => {
      res.json("the requests has been sent");
    })
    .catch((err) => res.json("Error:" + err));
});

router.route("/get").get((req: Request, res: Response) => {
  SendRequest.find()
    .then((SendRequest: any) => res.json(SendRequest))
    .catch((err: any) => res.status(400).json("Error:" + err));
});

export default router;
