import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";

const predict = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const { data } = req.body;
    const { nutrientLevel, modelInputData } = data;
    console.log(`Number of nutrients: ${nutrientLevel}`);
    console.log(`Model input: ${modelInputData}`);
    const response = await axios.post("http://127.0.0.1:5001/predict", {
      nutrientLevel: nutrientLevel,
      modelInputData: modelInputData,
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
