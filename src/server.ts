import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// config cors and json
app.use(express.json());
app.use(cors());

// routes here
app.use("/api", router);

app.listen(PORT, () => console.log(`Server running in ${PORT}`));
