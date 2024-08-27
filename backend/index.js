import express from "express";

const app = express();
app.use(express.json());

import predictRouter from "./src/routes/predict.route.js";

app.use("/api/v1/predict", predictRouter);

export { app };
