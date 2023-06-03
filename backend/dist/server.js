"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const digitalIdentities_routes_1 = __importDefault(require("./routes/digitalIdentities.routes"));
const cryptography_routes_1 = __importDefault(require("./routes/cryptography.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 9000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
const URI = process.env.MONGODB_URL;
mongoose_1.default.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err)
        throw err;
    console.log("Connected to MongoDB");
});
// Routes
app.get('/Allusers', (req, res) => {
    console.log(req.body);
});
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/digitalIdentities", digitalIdentities_routes_1.default);
app.use("/cryptography", cryptography_routes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
