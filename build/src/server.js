"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
// connect with database
require("./config/mongoose");
const handlerErrors_1 = require("./middlewares/handlerErrors");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// config cors and json
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// routes here
app.use("/api", routes_1.default);
// terms of service
app.use("/terms", (req, res) => {
    res.send("Termos of service!");
});
// use swagger for API documentation
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// handler errors
app.use(handlerErrors_1.HandlerErrors);
app.listen(PORT, () => console.log(`Server running in ${PORT}`));
