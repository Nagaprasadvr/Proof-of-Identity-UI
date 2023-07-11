import express, { Express, Request, Response, response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import digitalIdentities from "./routes/digitalIdentities.routes";
import cryptography from "./routes/cryptography.routes";
import dotenv from "dotenv";
import request from "./routes/requests.routes";

import emailVerification from "./routes/emailVerification.routes";

dotenv.config();
const app: Express = express();
const port = 9000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
const URI = process.env.MONGODB_URL as string;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  },
  (err) => {
    if (err) throw err;
  }
);
// Routes
app.get("/Allusers", (req: Request, res: Response) => {});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.use("/digitalIdentities", digitalIdentities);

app.use("/cryptography", cryptography);

app.use("/requests", request);

app.use("/emailVerification", emailVerification);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
