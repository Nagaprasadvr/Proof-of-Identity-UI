const { Routes } = require("react-router-dom");

const router = require("express").Router();

router.get("/getIdentities", (req, res) => {
  res.send("get Identity");
});

module.exports = router;
