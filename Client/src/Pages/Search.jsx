import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {Box, Container, Autocomplete, Tab, Tabs, Checkbox, FormControl, FormControlLabel, FormGroup, Button, FormHelperText, InputLabel, Slider, TextField} from "@mui/material";

function Search() {
  const [macroClass, setMacroClass] = useState("");
  const [catname, setCatName] = useState("");
  const [description, setDescription] = useState("");
  const [macroClasses, setMacroClasses] = useState([]);
  const [catnames, setCatNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [value, setValue] = useState(0);
  const [nutritionInfo, setNutritionInfo] = useState({
    Protein: [0.0, 14.26],
    "Total Fat": [0.0, 25.05],
    Carbohydrate: [2.19, 59.25],
    "Sugars, total": [0.0, 31.5],
    "Fiber, total dietary": [0.0, 6.21],
    Calcium: [0.0, 283.17],
    Iron: [0.0, 9.07],
    Sodium: [0.0, 1171.91],
    "Vitamin D (D2 + D3)": [0.0, 2.1],
    Cholesterol: [0.0, 62.7],
    "Fatty acids, total saturated": [0.0, 8.71],
    Potassium: [0.0, 518.72],
    Energy: [57.82, 408.16]
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [state, setState] = useState({
    novaClass1: false,
    novaClass2: false,
    novaClass3: false,
    novaClass4: false
  });

  const handleChangeNovaClass = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });
  };

  useEffect(() => {
    fetchMacroClasses(macroClass);
    fetchCatNames(macroClass, catname);
    fetchDescriptions(macroClass, catname, description);
  }, []);

  const fetchMacroClasses = (value) => {
    axios
      .get(
        `https://cosylab.iiitd.edu.in/food-processing-db-api/macroclass?macroclass=${value}`
      )
      .then(function (response) {
        setMacroClasses(response?.data?.payload);
      });
  };

  const fetchCatNames = (macroClass, value) => {
    axios
      .get(
        `https://cosylab.iiitd.edu.in/food-processing-db-api/catname?macroclass=${macroClass}&catname=${value}`
      )
      .then(function (response) {
        setCatNames(response?.data?.payload);
      });
  };

  const fetchDescriptions = (macroClass, catname, value) => {
    axios
      .get(
        `https://cosylab.iiitd.edu.in/food-processing-db-api/description?macroclass=${macroClass}&catname=${catname}&description=${value}`
      )
      .then(function (response) {
        setDescriptions(response?.data?.payload);
      });
  };

  const navigate = useNavigate();

  const navigateToResults = () => {
    let novaclass = [];
    if (state?.novaClass1) {
      novaclass.push(1);
    }
    if (state?.novaClass2) {
      novaclass.push(2);
    }
    if (state?.novaClass3) {
      novaclass.push(3);
    }
    if (state?.novaClass4) {
      novaclass.push(4);
    }
    const type =
      value == 0
        ? "category"
        : value == 1
        ? "novaclass"
        : value == 2
        ? "nutrients"
        : value == 3
        ? "advanced"
        : "";
    navigate(
      `/search-result?type=${type}&macroclass=${macroClass}&catname=${catname}&description=${description}&novaclass=${novaclass}&Protein=${nutritionInfo?.Protein}&Total Fat=${nutritionInfo?.["Total Fat"]}&Carbohydrate=${nutritionInfo?.Carbohydrate}&Sugars, total=${nutritionInfo?.["Sugars, total"]}&Fiber, total dietary=${nutritionInfo?.["Fiber, total dietary"]}&Calcium=${nutritionInfo?.Calcium}&Iron=${nutritionInfo?.Iron}&Sodium=${nutritionInfo?.Sodium}&Vitamin=${nutritionInfo?.["Vitamin D (D2 + D3)"]}&Cholesterol=${nutritionInfo?.Cholesterol}&Fatty acids, total saturated=${nutritionInfo?.["Fatty acids, total saturated"]}&Potassium=${nutritionInfo?.Potassium}&Energy=${nutritionInfo?.Energy}`
    );
  };

  return (
    <Container maxWidth="lg">
      <div className="search__wrapper">
        <br />
        <>
          <Box sx={{ bgcolor: "background.paper" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Category" />
              <Tab label="NOVA Class" />
              <Tab label="Nurtition" />
              <Tab label="Advanced" />
            </Tabs>
          </Box>
          {value == 0 || value == 3 ? (
            <span>
              <h2 style={{ textAlign: "left" }}>Category</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                  alignItems: "self-start"
                }}
              >
                <div className="form__wrapper">
                  <div>
                    <InputLabel htmlFor="input-protein">Macro Class</InputLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "4px",
                        gap: "20px"
                      }}
                    >
                      <span>
                        <Autocomplete
                          disablePortal
                          freeSolo
                          getOptionLabel={(option) => option}
                          onChange={(e, value, reason) => {
                            setMacroClass(value);
                            setCatName("");
                            setDescription("");
                            fetchCatNames(value, "");
                          }}
                          onInputChange={(e, value, reason) => {
                            fetchMacroClasses(value);
                          }}
                          options={macroClasses}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Enter Macro Class"
                              variant="outlined"
                            />
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form__wrapper">
                  <div>
                    <InputLabel htmlFor="input-protein">
                      Category Name
                    </InputLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "4px",
                        gap: "20px"
                      }}
                    >
                      <span>
                        <Autocomplete
                          disablePortal
                          freeSolo
                          getOptionLabel={(option) => option}
                          onChange={(e, value, reason) => {
                            setCatName(value);
                            setDescription("");
                            fetchDescriptions(macroClass, value, "");
                          }}
                          onInputChange={(e, value, reason) => {
                            fetchCatNames(macroClass, value);
                          }}
                          options={catnames}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Enter Category Name"
                              variant="outlined"
                            />
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form__wrapper">
                  <div>
                    <InputLabel htmlFor="input-protein">
                      Food Description
                    </InputLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "4px",
                        gap: "20px"
                      }}
                    >
                      <span>
                        <Autocomplete
                          disablePortal
                          freeSolo
                          getOptionLabel={(option) => option}
                          onChange={(e, value, reason) => setDescription(value)}
                          onInputChange={(e, value, reason) => {
                            fetchDescriptions(macroClass, catname, value);
                          }}
                          options={descriptions}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Enter Food Description"
                              variant="outlined"
                            />
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </span>
          ) : (
            ""
          )}
          {value == 1 || value == 3 ? (
            <span>
              <h2 style={{ textAlign: "left" }}>NOVA Class</h2>
              <div
                style={{
                  display: "flex"
                }}
              >
                <FormControl
                  required
                  component="fieldset"
                  sx={{ m: 3 }}
                  margin="normal"
                  variant="standard"
                >
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.novaClass1}
                          onChange={handleChangeNovaClass}
                          name="novaClass1"
                        />
                      }
                      label="Unprocessed (NOVA Class 1)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.novaClass2}
                          onChange={handleChangeNovaClass}
                          name="novaClass2"
                        />
                      }
                      label="Processed Culinary Ingredients (NOVA Class 2)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.novaClass3}
                          onChange={handleChangeNovaClass}
                          name="novaClass3"
                        />
                      }
                      label="Processed (NOVA Class 3)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.novaClass4}
                          onChange={handleChangeNovaClass}
                          name="novaClass4"
                        />
                      }
                      label="Ultra-Processed (NOVA Class 4)"
                    />
                  </FormGroup>

                  <FormHelperText>
                    {" "}
                    Select all to get all classes
                  </FormHelperText>
                </FormControl>
              </div>
            </span>
          ) : (
            ""
          )}
          {value == 2 || value == 3 ? (
            <span>
              <h2 style={{ textAlign: "left" }}>Nutrition</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "240px"
                }}
              >
                <div className="form__wrapper">
                  {nutritionList?.map((column, index) => {
                    return (
                      <div className="form__content">
                        <InputLabel htmlFor="input-protein">
                          {column}
                        </InputLabel>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px"
                          }}
                        >
                          <span style={{ width: "90%" }}>
                            <Slider
                              size="small"
                              min={metadata?.[column]?.min}
                              max={metadata?.[column]?.max}
                              value={nutritionInfo?.[column]}
                              onChange={(e) => {
                                setNutritionInfo((nutritionInfo) => ({
                                  ...nutritionInfo,
                                  [column]: e.target.value
                                }));
                              }}
                              aria-label="Default"
                              valueLabelDisplay="auto"
                            />
                          </span>
                          <span style={{ width: "10%" }}>
                            {metadata?.[column]?.unit || ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </span>
          ) : (
            ""
          )}
          <br />
          <Button
            style={{ marginRight: "20px" }}
            onClick={() => {
              navigateToResults();
            }}
            className="button"
          >
            Search
          </Button>
        </>
      </div>
    </Container>
  );
}

export default Search;

const metadata = {
  Protein: {
    min: 0.0,
    max: 62.88,
    range: [0.0, 14.26],
    mean: 6.71,
    median: 4.55,
    unit: "g"
  },
  "Total Fat": {
    min: 0.0,
    max: 100.0,
    range: [0.0, 25.05],
    mean: 9.88,
    median: 3.6,
    unit: "g"
  },
  Carbohydrate: {
    min: 0.0,
    max: 100.0,
    range: [2.19, 59.25],
    mean: 30.72,
    median: 18.33,
    unit: "g"
  },
  "Sugars, total": {
    min: 0.0,
    max: 99.8,
    range: [0.0, 31.5],
    mean: 13.72,
    median: 6.4,
    unit: "g"
  },
  "Fiber, total dietary": {
    min: 0.0,
    max: 77.3,
    range: [0.0, 6.21],
    mean: 2.29,
    median: 1.2,
    unit: "g"
  },
  Calcium: {
    min: 0.0,
    max: 3333.0,
    range: [0.0, 283.17],
    mean: 93.79,
    median: 37.0,
    unit: "mg"
  },
  Iron: {
    min: 0.0,
    max: 63.0,
    range: [0.0, 9.07],
    mean: 2.76,
    median: 0.99,
    unit: "mg"
  },
  Sodium: {
    min: 0.0,
    max: 26000.0,
    range: [0.0, 1171.91],
    mean: 357.31,
    median: 213.0,
    unit: "mg"
  },
  "Vitamin D (D2 + D3)": {
    min: 0.0,
    max: 33.4,
    range: [0.0, 2.1],
    mean: 0.49,
    median: 0.0,
    unit: "mcg"
  },
  Cholesterol: {
    min: 0.0,
    max: 1085.0,
    range: [0.0, 62.7],
    mean: 16.37,
    median: 0.0,
    unit: "mg"
  },
  "Fatty acids, total saturated": {
    min: 0.0,
    max: 86.5,
    range: [0.0, 8.71],
    mean: 3.21,
    median: 1.11,
    unit: "g"
  },
  Potassium: {
    min: 0.0,
    max: 6040.0,
    range: [0.0, 518.72],
    mean: 220.96,
    median: 158.0,
    unit: "mg"
  },
  Energy: {
    min: 0.0,
    max: 884.0,
    range: [57.82, 408.16],
    mean: 232.99,
    median: 222.0,
    unit: "kcal"
  }
};
const nutritionList = [
  "Protein",
  "Total Fat",
  "Carbohydrate",
  "Sugars, total",
  "Fiber, total dietary",
  "Calcium",
  "Iron",
  "Sodium",
  "Vitamin D (D2 + D3)",
  "Cholesterol",
  "Fatty acids, total saturated",
  "Potassium",
  "Energy"
];
