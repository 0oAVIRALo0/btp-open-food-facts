import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import predictRouter from "./src/routes/predict.route.js";

app.use("/api/v1/predict", predictRouter);

export { app };
