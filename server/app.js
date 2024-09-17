import dotenv from "dotenv";

dotenv.config();

import { app } from "./index.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, (req, res) => {
  console.log(`Server Started at: http://localhost:${PORT}`);
});
