import express,{Express,Request,Response} from "express";
import mongoose from "mongoose";

import digitalIdentities from "./routes/digitalIdentities.routes";
import dotenv from 'dotenv';
dotenv.config()
const app:Express = express();
const port = 9000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const URI = process.env.MONGODB_URL as string;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
  }
);
// Routes
app.get("/", (req:Request, res:Response) => {
  res.send("Hello, World!");
});
app.use("/digitalIdentities", digitalIdentities);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
