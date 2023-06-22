import { Request, Response, response } from "express";
import RequestModel from "../models/Request.model";
import express from "express";
import ResponseModel from "../models/Response.model";
import { ObjectId } from "mongodb";
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
  const senderPubkey: string = req.body.requestedSolPubkey;
  const rsaPubkey512: string = req.body.rsaPubkey512;
  const rsaPubkey1028: string = req.body.rsaPubkey1028;
  const contactNum: boolean = req.body.requestData.contactNum;

  const newRequest = new RequestModel({
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

  console.log("new req", newRequest);
  newRequest
    .save()
    .then((result) => {
      console.log("Request sent");
      res.json("the requests has been sent");
    })
    .catch((err) => res.json("Error:" + err));

  console.log("saved");
});

router.route("/getAll").get((req: Request, res: Response) => {
  RequestModel.find()
    .then((SendRequest: any) => res.json(SendRequest))
    .catch((err: any) => res.status(400).json("Error:" + err));
});

router.route("/get").post((req: Request, res: Response) => {
  const id = req.body.id;
  RequestModel.findById(id)
    .then((response: any) => {
      res.json({ data: response });
    })
    .catch((err: any) => console.log(err));
});

router.route("/approve").post((req: Request, res: Response) => {
  const requestId: string = req.body.requestId;
  const name: string = req.body.encUserData.name;
  const dob: string = req.body.encUserData.dob;
  const aadharNumber: string = req.body.encUserData.aadharNumber;
  const panNumber: string = req.body.encUserData.panNumber;
  const passportNumber: string = req.body.encUserData.passportNumber;
  const panUploadLink: string = req.body.encArweaveData.panUploadLink;
  const passportUploadLink: string = req.body.encArweaveData.passportUploadLink;
  const aadharUploadLink: string = req.body.encArweaveData.aadharUploadLink;
  const picUploadLink: string = req.body.encArweaveData.picUploadLink;
  const address: string = req.body.encUserData.address;

  const newResponse = new ResponseModel({
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
      res.json({ message: "the response has been sent", status: true });
    })
    .catch((err) => res.json("Error:" + err));

  RequestModel.updateOne(
    {
      _id: new ObjectId(requestId),
    },
    {
      $set: {
        state: "Approved",
      },
    },
    null,
    (err: any, res: any) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log("update success");
      }
    }
  );
});

router.route("/deny").post((req: Request, res: Response) => {
  const id = req.body.id;
  RequestModel.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        state: "Denied",
      },
    },
    null,
    (err: any, res: any) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log("update success");
      }
    }
  );
});

router.route("/cancel").post((req: Request, res: Response) => {
  const id = req.body.id;
  RequestModel.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        state: "Cancelled",
      },
    },
    null,
    (err: any, res: any) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log("update success");
      }
    }
  );
});

export default router;
