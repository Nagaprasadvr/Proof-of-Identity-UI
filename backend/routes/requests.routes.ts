import { Request, Response } from "express";
import SendRequest from "../models/SendIdentityRequest.model";
import express from "express";
const router = express();

router.route("/send").post((req: Request, res: Response) => {
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
  console.log("req data", req.body.requestData);
  const newRequest = new SendRequest({
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

export default router;
