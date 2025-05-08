import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";
import swaggerUi from "swagger-ui-express";

import swaggerDocs from "./swagger.json";

// connect with database
import "./config/mongoose";
import { HandlerErrors } from "./middlewares/handlerErrors";

const app = express();
const PORT = process.env.PORT || 3000;

// config cors and json
app.use(express.json());
app.use(cors());

// routes here
app.use("/api", router);

// terms of service
app.use("/terms", (req, res) => {
  res.send("Termos of service!");
});

// use swagger for API documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// handler errors
app.use(HandlerErrors);

app.listen(PORT, () => console.log(`Server running in ${PORT}`));
