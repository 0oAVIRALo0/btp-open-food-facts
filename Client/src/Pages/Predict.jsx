import React, { useState, useEffect } from "react";
import axios from "axios";

import {nutrientData, meanMedian, test12Data, test65Data, test102Data, test12Data as testData} from "../data";

import {InputLabel, Container, Button, CircularProgress, Slider, InputAdornment, TextField} from "@mui/material";
import { Button as AntdButton, Modal, Select} from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';

function getRandomInteger(maxIndex) {
  return Math.floor(Math.random() * (maxIndex + 1));
}

function formatTitle(string) {
  return string
    ?.replace(/^./, string[0].toUpperCase())
    .replace(/([a-z])([A-Z])/g, "$1 $2");
}

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

  const handleChangeSelect = (event) => {
    setNutrientLevel(event.target.value);
  };

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
        let temp = "";
        if (res?.data?.data?.Classification == 1)
          temp = "Unprocessed (NOVA Class 1)";
        else if (res?.data?.data?.Classification == 2)
          temp = "Processed Culinary Ingredients (NOVA Class 2)";
        else if (res?.data?.data?.Classification == 3)
          temp = "Processed (NOVA Class 3)";
        else if (res?.data?.data?.Classification == 4)
          temp = "Ultra-Processed (NOVA Class 4)";
        setResult(temp);
      })
      .catch((err) => {
        setLoading(false);
        setResult("Error");
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
            <div className="left">
              <div className="predict-nutrient-drop-down">
                
                <label>Select Nutrient Levle</label>
                <Select placeholder="Select Nutrient Level" className="edit-select-input"  onChange={e=>setNutrientLevel(e)} suffixIcon={<CaretDownOutlined style={{color:'#000000'}}/>}
                  options={[
                    {label:'7 Nutrients', value:"7Nutrients"},
                    {label:'8 Nutrients', value:"8Nutrients"},
                    {label:'45 Nutrients', value:"45Nutrients"},
                  ]}
                  getPopupContainer={trigger => trigger.parentElement}/> 
              </div>
              <Button
                className="button"
                onClick={() => setClicked(true)}
                disabled={!nutrientLevel}
                variant="contained"
              >
                Next
              </Button>
            </div>
            <div className="right">
              <img
                className="logo"
                src="/svg/select_nutrient.svg"
                alt="Select Nutrient"
              />
            </div>
          </div>
        ) : (
          <>
            {Object.keys(nutrientData?.[nutrientLevel]).map((ty, ind) => {
              return (
                <span key={ind}>
                  <h2 style={{ textAlign: "left" }}>
                    {formatTitle(
                      Object.keys(nutrientData?.[nutrientLevel]?.[ty])?.[0]
                    )}
                  </h2>
                  <div className="form__wrapper">
                    {Object.values(
                      nutrientData?.[nutrientLevel]?.[ty]
                    )?.[0]?.map((column, index) => {
                      const uniqueId = `${column}-${index}`;
                      return (
                        <div className="form__content" key={index}>
                          <InputLabel htmlFor={uniqueId}>{column}</InputLabel>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "20px",
                            }}
                          >
                            <span style={{ width: "70%" }}>
                              <Slider
                                id={uniqueId}
                                color={
                                  ind === 0
                                    ? "primary"
                                    : ind === 1
                                    ? "warning"
                                    : "secondary"
                                }
                                min={
                                  meanMedian?.[nutrientLevel]?.[column]?.min ||
                                  0
                                }
                                max={
                                  meanMedian?.[nutrientLevel]?.[column]?.max ||
                                  100
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
                                id="filled-basic"
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
                                      {meanMedian?.[nutrientLevel]?.[column]
                                        ?.unit || ""}
                                    </InputAdornment>
                                  ),
                                }}
                                variant="outlined"
                              />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </span>
              );
            })}
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
                onClick={() => {
                  setClicked(false);
                }}
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
              title="Prediction Result"
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
                <div style={{ fontSize: "24px", padding: "20px 0" }}>
                  The food is <span style={{ color: "green" }}>{result}</span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div style={{display:'flex', justifyContent:'flex-end'}}>
              <AntdButton onClick={() => setPredictModal(false)} className="close-button">Ok</AntdButton>
            </div>
          </Modal>
        )}
      </div>
    </Container>
  );
}

export default Predict;
