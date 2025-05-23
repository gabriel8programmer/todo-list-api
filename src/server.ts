import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";

// connect with database
import "./config/mongoose";
import { HandlerErrors } from "./middlewares/handlerErrors";

const app = express();
const PORT = process.env.PORT;

// config cors and json
app.use(express.json());
app.use(cors());

// routes here
app.use("/api", router);

// terms of service
app.use("/terms", (req, res) => {
  res.send("Terms of service here!"); // just example
});

// use swagger for API documentation
const swaggerPath = path.resolve(__dirname, "../swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// handler errors
app.use(HandlerErrors);

app.listen(PORT, () => console.log(`Server running in ${PORT}`));
