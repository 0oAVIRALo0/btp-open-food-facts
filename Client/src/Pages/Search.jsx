import React, {useState, useEffect} from 'react'

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Container,
  Tab,
  Tabs,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Button,
  FormHelperText,
  InputLabel,
  TextField,
} from "@mui/material";


function Search() {
  const [value, setValue] = useState(0);

  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [state, setState] = useState({
    novaClass1: false,
    novaClass2: false,
    novaClass3: false,
    novaClass4: false,
  });

  const handleChangeNovaClass = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
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
      ? "novaclass"
      : value == 1
      ? "category"
      : "";

    localStorage.setItem("activeNavBar", 2); 
    navigate(
      `/search-result?type=${type}&novaclass=${novaclass}&categoryName=${categoryName}&brandName=${brandName}&productName=${productName}`
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
              <Tab label="NOVA Class" />
              <Tab label="Category" />
            </Tabs>
          </Box>
          {value == 0 ? (
            <span>
              <h2 style={{ textAlign: "left", color: "#638773" }}>NOVA Class</h2>
              <div style={{ display: "flex" }}>
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
                          sx={{
                            color: "#e69c52",
                            "&.Mui-checked": {
                              color: "#e69c52",
                            },
                          }}
                        />
                      }
                      label="Unprocessed (NOVA Class 1)"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: "#e69c52",
                        },
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.novaClass2}
                          onChange={handleChangeNovaClass}
                          name="novaClass2"
                          sx={{
                            color: "#e69c52",
                            "&.Mui-checked": {
                              color: "#e69c52",
                            },
                          }}
                        />
                      }
                      label="Processed Culinary Ingredients (NOVA Class 2)"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: "#e69c52",
                        },
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.novaClass3}
                          onChange={handleChangeNovaClass}
                          name="novaClass3"
                          sx={{
                            color: "#e69c52",
                            "&.Mui-checked": {
                              color: "#e69c52",
                            },
                          }}
                        />
                      }
                      label="Processed (NOVA Class 3)"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: "#e69c52",
                        },
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.novaClass4}
                          onChange={handleChangeNovaClass}
                          name="novaClass4"
                          sx={{
                            color: "#e69c52",
                            "&.Mui-checked": {
                              color: "#e69c52",
                            },
                          }}
                        />
                      }
                      label="Ultra-Processed (NOVA Class 4)"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: "#e69c52",
                        },
                      }}
                    />
                  </FormGroup>

                  <FormHelperText>Select all to get all classes</FormHelperText>
                </FormControl>
              </div>
            </span>
          ) : (
            ""
          )}
          {value == 1 ? (
            <span>
               <h2 style={{ textAlign: "left", color : '#638773'}}>Category</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                  alignItems: "self-start",
                }}
              >
                <div className="form__wrapper">
                  <div>
                  <InputLabel style={{color: "#e69c52",  marginBottom: "2px"}} htmlFor="input-protein">
                      Category Name
                    </InputLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "4px",
                        marginBottom: "2px",
                        gap: "20px",
                      }}
                    >
                      <span>
                        <TextField id="standard-basic" label="Category Name" variant="standard" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} slotProps={{input: { style: { color: "green" }}}}/>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form__wrapper">
                  <div>
                    <InputLabel style={{color: "#e69c52",  marginBottom: "2px"}} htmlFor="input-protein">Brand Name</InputLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "4px",
                        gap: "20px",
                      }}
                    >
                      <span>
                        <TextField id="standard-basic" label="Brand Name" variant="standard" value={brandName} onChange={(e) => setBrandName(e.target.value)} slotProps={{input: { style: { color: "green" }},}}/>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form__wrapper">
                  <div>
                    <InputLabel style={{color: "#e69c52", marginBottom: "2px"}} htmlFor="input-protein">
                      Product Name
                    </InputLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "4px",
                        gap: "20px",
                      }}
                    >
                      <span>
                        <TextField 
                          id="standard-basic" 
                          label="Product Name" 
                          variant="standard"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          slotProps={{
                            input: {
                              style: { color: "green" }, // Apply green text color
                            },
                          }}
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