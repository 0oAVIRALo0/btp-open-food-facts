import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";

const predict = asyncHandler(async (req, res) => {
  try {
    const { model, input } = req.body;
    console.log(`Model: ${model}`);
    console.log(`Input: ${input}`);
    const response = await axios.post("http://127.0.0.1:5001/predict", {
      model: model,
      input: input,
    });
    res.json({
      message: "Successfully classified data!",
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while making prediction");
  }
});

export { predict };
