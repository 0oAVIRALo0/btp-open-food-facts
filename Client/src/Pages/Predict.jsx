import React, { useState, useEffect } from "react";
import axios from "axios";

import {nutrientData, meanMedian, test12Data, test65Data, test102Data, test12Data as testData} from "../data";

import {InputLabel, Container, Button, CircularProgress, Slider, InputAdornment, TextField} from "@mui/material";
import { Button as AntdButton, Modal, Select} from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';
import { PiStepsFill } from "react-icons/pi";
import { PiLeafFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { HiBolt } from "react-icons/hi2";
import { BsFillDropletFill } from "react-icons/bs";
import PredictBanner from "/svg/PredictBanner.svg";

import NOVA1 from "/svg/NOVA1.svg"
import NOVA2 from "/svg/NOVA2.svg"
import NOVA3 from "/svg/NOVA3.svg"
import NOVA4 from "/svg/NOVA4.svg"

function getRandomInteger(maxIndex) {
  return Math.floor(Math.random() * (maxIndex + 1));
}

function formatTitle(string) {
  return string
    ?.replace(/^./, string[0].toUpperCase())
    .replace(/([a-z])([A-Z])/g, "$1 $2");
}

const nutrients = [
  { id: 1, logo: <PiStepsFill />, heading: "Macronutrients", examples: "Calories, Carbs, Fats, Protein" },
  { id: 2, logo: <PiLeafFill />, heading: "Micronutrients", examples: "Magnesium, Iron, Zinc, Copper" },
  { id: 3, logo: <FaHeart/>, heading: "Vitamins", examples: "Vitamin A, B1, B2, B3, B5, B6, B9, B12, C, D, E, K" },
  { id: 4, logo: <GiWeightLiftingUp />, heading: "Minerals", examples: "Calcium, Phosphorus, Potassium, Sodium" },
  { id: 5, logo: <HiBolt />, heading: "Amino Acids", examples: "Tryptophan, Threonine, Isoleucine, Leucine, Lysine, Methionine, Phenylalanine, Valine, Histidine" },
  { id: 6, logo: <BsFillDropletFill />, heading: "Fatty Acids", examples: "Saturated, Monounsaturated, Polyunsaturated" },
]

const novaClasses = [
  { 
    id: 1, 
    image: NOVA1, 
    heading: "Unprocessed or Minimally Processed Foods", 
    subheading: "This class encompasses all edible parts of plants, animals, and fungi that are obtained directly from nature. The primary focus is on preserving their natural state and nutritional value without any significant alterations or additives.", 
    examples: "fresh, frozen or dried fruit, vegetables, legumes, nuts, seeds, whole grains, eggs, fresh or frozen meat, fish, shellfish, poultry, milk, yogurt, cheese, oil, vinegar, sugar,"
  },
  { 
    id: 2, 
    image: NOVA2, 
    heading: "Processed Culinary Ingredients", 
    subheading: "This category includes ingredients derived from unprocessed foods that have undergone minimal processing. These ingredients are primarily used in the preparation of meals, enhancing flavor and texture without the use of artificial additives.", 
    examples: "flour, butter, oil, sugar, honey, maple syrup, salt, pepper, herbs, spices, baking powder, baking soda, chocolate, pasta, rice, bread, tofu, tempeh, miso, canned tomatoes, tomato paste"
  },
  { 
    id: 3, 
    image: NOVA3, 
    heading: "Processed Foods", 
    subheading: "Processed foods refer to items that have been altered from their original form through methods like freezing, canning, or baking. These products are often convenient and ready-to-eat, but they may contain additional ingredients for preservation or flavor.", 
    examples: "bread, crackers, cheese, yogurt, canned beans, canned fish, canned tomatoes, frozen fruits, frozen vegetables, tofu, tempeh, miso, hummus, nut butter, seed butter, fruit preserves, pickles, sauerkraut"
  },
  { 
    id: 4, 
    image: NOVA4, 
    heading: "Ultra-Processed Food and Drink Products", 
    subheading: "This class consists of highly processed food and drink products that contain artificial ingredients, flavor enhancers, and preservatives. These items are often high in sugar, salt, and unhealthy fats, making them less nutritious and more addictive.", 
    examples: "packaged snacks, sugary cereals, sweetened yogurt, candy, soda, sports drinks, energy drinks, sweetened iced tea, sweetened lemonade, sweetened iced coffee, sweetened juice drinks,"
  }
]


function Predict() {
  const [nutrientLevel, setNutrientLevel] = useState("");
  const [clicked, setClicked] = useState(false);
  const [dummyData, setDummyData] = useState(testData);
  const [nutritionInfo, setNutritionInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [predictModal, setPredictModal] = useState(false);


  useEffect(() => {
    if (nutrientLevel == "7Nutrients") {
      setDummyData(test12Data);
    } else if (nutrientLevel == "8Nutrients") {
      setDummyData(test65Data);
    } else setDummyData(test102Data);
  }, [nutrientLevel]);

  useEffect(() => {
    // console.log(dummyData);
    setNutritionInfo(dummyData[0]);
  }, [dummyData]);

  const onPredict = (val) => {
    setPredictModal(true);
    setLoading(true);
    let nutrient = "";
    let url = "http://localhost:8000/api/v1/predict/predict-class";
    if (nutrientLevel == "7Nutrients") nutrient = "7";
    else if (nutrientLevel == "8Nutrients") nutrient = "8";
    else nutrient = "45";

    const data = {
      nutrientLevel: nutrient,
      modelInputData: Object.values(val).map(Number),
    };

    axios
      .post(url, { data })
      .then((res) => {
        setLoading(false);
        console.log(res);
        setResult(novaClasses.find(nova => nova.id === res?.data?.data?.Classification))
      })
      .catch((err) => {
        setLoading(false);
        setResult("Error");
        // setResult(novaClasses.find(nova => nova.id === 1))
      });
  };

  // useEffect(() => {
  //   if (nutrientData?.[nutrientLevel]?.[0])
  //     console.log("WTF",Object.keys(nutrientData?.[nutrientLevel]?.[0])?.[0]);
  // }, [nutrientLevel]);

  return (
    <Container maxWidth="lg">
      <div className="predict__wrapper">
        {!clicked ? (
          <div className="nutrient-select-container">
            <div className="banner" style={{backgroundImage: `url(${PredictBanner})`}}>
              <div className="info">
                <div className="overlay-text">
                  <h2>Explore the NOVA class of any food based on it's nutrient content</h2>
                </div> 
                <div className="predict-nutrient-drop-down">
                    <Select placeholder="Select Nutrient Level" className="edit-select-input"  onChange={e=>setNutrientLevel(e)} suffixIcon={<CaretDownOutlined style={{color:'#000000'}}/>}
                      options={[
                        {label:'7 Nutrients', value:"7Nutrients"},
                        {label:'8 Nutrients', value:"8Nutrients"},
                        {label:'45 Nutrients', value:"45Nutrients"},
                      ]}
                    getPopupContainer={trigger => trigger.parentElement}/> 
                    <Button
                      className="button"
                      onClick={() => setClicked(true)}
                      disabled={!nutrientLevel}
                      variant="contained"
                    >
                      Next
                    </Button>
                </div>
              </div>
            </div>
            <div className="nutrients">
              {nutrients.map((nutrient) => (
                <div key={nutrient.id} className="nutrient">
                  <div className="logo">{nutrient.logo}</div>
                  <h3>{nutrient.heading}</h3>
                  <p>{nutrient.examples}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {Object.keys(nutrientData?.[nutrientLevel]).map((ty, ind) => (
              <span key={ind}>
                <h2 style={{ textAlign: "left" }}>
                  {formatTitle(
                    Object.keys(nutrientData?.[nutrientLevel]?.[ty])?.[0]
                  )}
                </h2>
                <div className="form__wrapper">
                  {Object.values(nutrientData?.[nutrientLevel]?.[ty])?.[0]?.map(
                    (column, index) => {
                      const uniqueId = `${column}-${ty}-${index}`; // Ensure unique ID

                      return (
                        <div className="form__content" key={uniqueId}>
                          <label htmlFor={`slider-${uniqueId}`} style={{color: "#e69c52"}}>{column}</label>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "20px",
                            }}
                          >
                            <span style={{ width: "70%" }}>
                              <Slider
                                id={`slider-${uniqueId}`}
                                color="success" // Green color
                                min={
                                  meanMedian?.[nutrientLevel]?.[column]?.min || 0
                                }
                                max={
                                  meanMedian?.[nutrientLevel]?.[column]?.max || 100
                                }
                                value={Number(nutritionInfo?.[column]) || 0}
                                onChange={(e) => {
                                  setNutritionInfo((nutritionInfo) => ({
                                    ...nutritionInfo,
                                    [column]: Number(e.target.value),
                                  }));
                                }}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                              />
                            </span>
                            <span style={{ width: "30%" }}>
                              <TextField
                                id={`input-${uniqueId}`}
                                value={nutritionInfo?.[column]}
                                type="number"
                                onChange={(e) => {
                                  setNutritionInfo((nutritionInfo) => ({
                                    ...nutritionInfo,
                                    [column]: e.target.value,
                                  }));
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      {meanMedian?.[nutrientLevel]?.[column]?.unit ||
                                        ""}
                                    </InputAdornment>
                                  ),
                                }}
                                variant="outlined"
                              />
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </span>
            ))}
            <div className="button-footer">
              <Button
                className="button"
                onClick={() => {
                  setResult("");
                  setNutritionInfo(
                    dummyData[getRandomInteger(dummyData?.length)]
                  );
                }}
                variant="contained"
              >
                Shuffle
              </Button>
              <Button
                className="button"
                onClick={() => setClicked(false)}
                variant="contained"
              >
                Back
              </Button>
              <Button
                onClick={() => onPredict(nutritionInfo)}
                className="button"
                variant="contained"
              >
                Predict
              </Button>
            </div>
          </>
        )}

        {predictModal && (
          <Modal
            width='60%'
              open={predictModal}
              className="prediction-modal"
              onCancel={() => setPredictModal(false)}
              onOk={() => setPredictModal(false)}
            > 
        
            <div className="wrapper">
              {loading ? (
                <span>
                  <br /> <br />
                  <CircularProgress size={40} />
                </span>
              ) : result == "Error" ? (
                <div style={{ color: "red", fontSize: "24px", padding: "20px 0" }}>
                  Something Went Wrong
                </div>
              ) : result ? (
                <>
                  <div className="left">
                    <img src={result.image} alt={`NOVA Class ${result.id} Poster`} width="223px"/>
                  </div>
                  <div className="right">
                    <h2>NOVA Class {result.id}: <span>{result.heading}</span></h2>
                    <p>{result.subheading}</p>
                    <p><span>Examples: </span>{result.examples}</p>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </Modal>
        )}
      </div>
    </Container>
  );
}

export default Predict;
