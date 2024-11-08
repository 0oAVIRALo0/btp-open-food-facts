import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend domain
  methods: ['GET', 'POST'], // Specify allowed methods if needed
  credentials: true // Enable cookies
}));
app.use(bodyParser.urlencoded({ extended: true }));

import predictRouter from "./src/routes/predict.route.js";
import searchRouter from "./src/routes/search.route.js";

app.use("/api/v1/predict", predictRouter);
app.use("/api/v1/search", searchRouter);

export { app };
