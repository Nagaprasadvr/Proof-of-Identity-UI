import { Request,Response } from "express";
import SendRequest from "../models/SendIdentityRequest.model";
import express from "express"
const router = express();

router.route("/send").post((req:Request, res:Response )  => {
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
      address: address
  });
    
    newRequest.save().then(() => {
        res.json("the requests is been stored");
    }).catch((err) => res.json("Error:" + err));
});

export default router;