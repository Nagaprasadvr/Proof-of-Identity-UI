const express = require("express");
const app = express();
const port = 9000;
const mongoose = require("mongoose");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URI = process.env.MONGODB_URL;
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
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(require("./routes/digitalIdentities.routes"));
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
