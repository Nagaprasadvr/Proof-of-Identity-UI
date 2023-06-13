"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendIdentityRequest_model_1 = __importDefault(require("../models/SendIdentityRequest.model"));
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
router.route("/:id").delete((req, res) => {
    const id = req.params.id;
    SendIdentityRequest_model_1.default.findByIdAndDelete(id)
        .then((response) => res.send("the data successfully denied"))
        .catch((err) => console.log(err));
});
router.route("/").get((req, res) => {
    return res.send("hello");
});
exports.default = router;
