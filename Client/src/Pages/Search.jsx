import React, { useState, useEffect } from 'react'
import axios from 'axios'

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

  const getUniqueCategories = () => {
    // Api call to get categories
    axios.get("http://localhost:8000/api/v1/search/unique-categories")
    .then((res) => {
      // console.log(res.data.data.categories);
      setCategories((prev) => [...prev, ...res.data.data.categories]);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const getUniqueBrands = () => {
    // Api call to get brands
    axios.get("http://localhost:8000/api/v1/search/unique-brands")
    .then((res) => {
      // console.log(res.data.data.brands);
      setBrands((prev) => [...prev, ...res.data.data.brands]);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const getUniqueProducts = () => {
    // Api call to get products
    axios.get("http://localhost:8000/api/v1/search/unique-product-names")
    .then((res) => {
      // console.log(res.data.data.productNames);
      setProducts((prev) => [...prev, ...res.data.data.productNames]);
    })
    .catch((err) => {
      console.log(err);
    }) 
  }

  useEffect(() => {
    getUniqueCategories();
    getUniqueBrands();
    getUniqueProducts();
  }, []);
  
  const getBrands = (selectedCategory) => {
    axios.get(`http://localhost:8000/api/v1/search/getBrandByCategory?categoryName=${selectedCategory}`)
      .then((res) => {
        setBrands(res.data.data.resultBrands);
        setProducts([]); 
        console.log("WTF", res.data.data.resultBrands)
      })
      .catch((err) => console.log(err));
  };
  
  const getProducts = (selectedCategory, selectedBrand) => {
    axios.get(`http://localhost:8000/api/v1/search/unique-product-names?category=${selectedCategory}&brand=${selectedBrand}`)
      .then((res) => {
        setProducts(res.data.data.productNames);
      })
      .catch((err) => console.log(err));
  };
  
  // Fetch brands when categoryName changes
  useEffect(() => {
    if (categoryName) {
      getBrands(categoryName);
      setBrandName(""); 
    }
  }, [categoryName]);
  
  // Fetch products when brandName changes
  useEffect(() => {
    if (categoryName && brandName) {
      getProducts(categoryName, brandName);
      setProductName(""); // Clear product selection if brand changes
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

  const [catOptions, setCatOptions] = useState([...categories]);

  const handleShowMoreCategories = () => {
    // Simulate loading more categories (e.g., fetch from API)
    const moreCategories = [
      "Category 5",
      "Category 6",
      "Category 7",
      "Category 8",
    ];
    setCategories(prevOptions => [...prevOptions, ...moreCategories]);
  };

  const handleShowMoreBrands = () => {
    // Simulate loading more brands (e.g., fetch from API)
    const moreBrands = [
      "Brand 5",
      "Brand 6",
      "Brand 7",
      "Brand 8",
    ];

    setBrands(prevOptions => [...prevOptions, ...moreBrands]);
  };

  const handleShowMoreProducts = () => {
    // Simulate loading more products (e.g., fetch from API)
    const moreProducts = [
      "Product 5",
      "Product 6",
      "Product 7",
      "Product 8",
    ];

    setProducts(prevOptions => [...prevOptions, ...moreProducts]);
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
                              InputProps={{
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
                                  onClick={handleShowMoreCategories}
                                  style={{
                                    color: "blue",
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
                              InputProps={{
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
                                  onClick={handleShowMoreBrands}
                                  style={{
                                    color: "blue",
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
                              InputProps={{
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
                                  onClick={handleShowMoreProducts}
                                  style={{
                                    color: "blue",
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
          >
            Search
          </Button>
        </>
      </div>
    </Container>
  );
}
    
export default Search;