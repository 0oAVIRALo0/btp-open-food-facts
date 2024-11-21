import React, { useState, useEffect } from 'react'

import {api, requests} from '../Utility'

import { useNavigate } from "react-router-dom";

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
  Autocomplete,
  ListSubheader,
} from "@mui/material";

function Search() {
  const [value, setValue] = useState(0);

  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [state, setState] = useState({
    novaClass1: false,
    novaClass2: false,
    novaClass3: false,
    novaClass4: false,
  });
  const isStateAllFalse = Object.values(state).every((val) => val === false);

  const [categoryPage, setCategoryPage] = useState(0);
  const [brandPage, setBrandPage] = useState(0);
  const [productPage, setProductPage] = useState(0);

  const getUniqueCategories = () => {
    const nextPage = categoryPage + 1;
    
    api.get(`${requests.searchUnique.category}?page=${nextPage}`)
      .then((res) => {
        setCategories(res.data.data.categories);
        setCategoryPage(nextPage);
      })
      .catch((err) => console.log(err));
  };

  const getUniqueBrands = () => {
    const nextPage = brandPage + 1;
    
    api.get(`${requests.searchUnique.brands}?category=${categoryName}&page=${nextPage}`)
      .then((res) => {
        setBrands(res.data.data.brands);
        setBrandPage(nextPage); 
      })
      .catch((err) => console.log(err));
  };

  const getUniqueProducts = () => {
    const nextPage = productPage + 1;
    
    api.get(`${requests.searchUnique.productName}?category=${categoryName}&brand=${brandName}&page=${nextPage}`)
      .then((res) => {
        setProducts(res.data.data.productNames);
        setProductPage(nextPage); 
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUniqueCategories();
    getUniqueBrands();
    getUniqueProducts();
  }, []);
  
  const getBrands = (selectedCategory) => {
    api.get(`${requests.searchBy.category}?categoryName=${selectedCategory}`)
      .then((res) => {
        setBrands(res.data.data);
        setProducts([]); 
      })
      .catch((err) => console.log(err));
  };
  
  const getProducts = (selectedCategory, selectedBrand) => {
    api.get(`${requests.searchBy.categoryAndBrand}?categoryName=${selectedCategory}&brandName=${selectedBrand}`)
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  
  useEffect(() => {
    if (categoryName) {
      getBrands(categoryName);
      setBrandName(""); 
    }
  }, [categoryName]);
  
  useEffect(() => {
    if (categoryName && brandName) {
      getProducts(categoryName, brandName);
      setProductName(""); 
    }
  }, [brandName]);

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

    localStorage.setItem("activeNavBar", 2); 
    navigate(
      `/search-result?&novaclass=${novaclass}&categoryName=${categoryName}&brandName=${brandName}&productName=${productName}`
    );
  };

  const showMoreOption = "Show More";

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
                    <InputLabel style={{ color: "#e69c52", marginBottom: "2px" }} htmlFor="input-category">
                      Category Name
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
                        <Autocomplete
                          id="category-dropdown"
                          options={categories}
                          value={categoryName}
                          freeSolo
                          onChange={(e, newValue) => {setCategoryName(newValue)}}  
                          onInputChange={(e, newInputValue) => setCategoryName(newInputValue)} 
                          sx={{
                            width: "200px",
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Category Name"
                              variant="standard"
                              slotProps={{
                                ...params.InputProps,
                                style: { color: "green" },
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              {option}
                            </li>
                          )}
                          
                          ListboxComponent={(props) => (
                            <div {...props}>
                              {props.children}
                              <ListSubheader>
                                <Button
                                  onClick={getUniqueCategories}
                                  style={{
                                    color: "#638773",
                                    backgroundColor: "#d1e0da",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    width: "100%",
                                  }}
                                  key={showMoreOption}
                                >
                                  Show More
                                </Button>
                              </ListSubheader>
                            </div>
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form__wrapper">
                  <div>
                    <InputLabel style={{ color: "#e69c52", marginBottom: "2px" }} htmlFor="input-protein">
                      Brand Name
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
                        <Autocomplete
                          id="brand-dropdown"
                          options={brands}  
                          value={brandName}       
                          freeSolo                   
                          onChange={(e, newValue) => setBrandName(newValue)}  // Sets value when option is selected
                          onInputChange={(e, newInputValue) => setBrandName(newInputValue)} // Capture changes when user types
                          sx={{
                            width: "200px",
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Brand Name"
                              variant="standard"
                              slotProps={{
                                ...params.InputProps,
                                style: { color: "green" }, // Apply green text color
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              {option}
                            </li>
                          )}

                          // Add the "Show More" button below the dropdown list
                          ListboxComponent={(props) => (
                            <div {...props}>
                              {props.children}
                              <ListSubheader>
                                <Button
                                  onClick={getUniqueBrands}
                                  style={{
                                    color: "#638773",
                                    backgroundColor: "#d1e0da",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    width: "100%",
                                  }}
                                  key={showMoreOption}
                                >
                                  Show More
                                </Button>
                              </ListSubheader>
                            </div>
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form__wrapper">
                  <div>
                    <InputLabel style={{ color: "#e69c52", marginBottom: "2px" }} htmlFor="input-protein">
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
                        <Autocomplete
                          id="product-dropdown"
                          options={products}  
                          value={productName}       
                          freeSolo                   
                          onChange={(e, newValue) => setProductName(newValue)}  // Sets value when option is selected
                          onInputChange={(e, newInputValue) => setProductName(newInputValue)} // Capture changes when user types
                          sx={{
                            width: "200px",
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Product Name"
                              variant="standard"
                              slotProps={{
                                ...params.InputProps,
                                style: { color: "green" }, // Apply green text color
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              {option}
                            </li>
                          )}

                          // Add the "Show More" button below the dropdown list
                          ListboxComponent={(props) => (
                            <div {...props}>
                              {props.children}
                              <ListSubheader>
                                <Button
                                  onClick={getUniqueProducts}
                                  style={{
                                    color: "#638773",
                                    backgroundColor: "#d1e0da",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    width: "100%",
                                  }}
                                  key={showMoreOption}
                                >
                                  Show More
                                </Button>
                              </ListSubheader>
                            </div>
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
          <br />
          <Button
            style={{ marginRight: "20px" }}
            onClick={() => {
              navigateToResults();
            }}
            className="button"
            disabled={value === 0 && isStateAllFalse} 
            variant="contained"
          >
            Search
          </Button>
        </>
      </div>
    </Container>
  );
}
    
export default Search;