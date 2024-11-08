import dotenv from "dotenv";

dotenv.config();

import { Client } from "@elastic/elasticsearch";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";

const ES_INDEX = "open-food-facts-database";
let maxLength = 0;

const client = new Client({
  node: process.env.ES_NODE,
  requestTimeout: 1200000, 
  maxRetries: 3,
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    apiKey: process.env.ES_API_KEY,
  },
  tls: {
    ca: fs.readFileSync(
<<<<<<< Updated upstream
      "/Users/aviralchauhan/aws-es-kibana/elasticsearch-8.15.3/config/certs/http_ca.crt"
=======
      "/Users/mahanshaditya/Downloads/DevTools/elasticsearch/config/certs/http_ca.crt"
>>>>>>> Stashed changes
    ),
    rejectUnauthorized: false,
  },
});

const getResultByNovaGroup = async (  
  pageNumber,
  entriesPerPage,
  novaGroups,
  from
) => {
  const startTime = new Date();

  const query = {
    query: {
      bool: {
        must:
          novaGroups.length > 0
            ? [
                {
                  terms: {
                    nova_group: novaGroups,
                  },
                },
              ]
            : [],
      },
    },
    size: entriesPerPage,
    from: from,
  };

  const searchResult = await client.search({
    index: ES_INDEX,
    body: query,
  });

  const endTime = new Date(); 
  const timeTaken = endTime - startTime; 

  console.log(
    "Full Elasticsearch response for nova groups:",
    JSON.stringify(searchResult, null, 2)
  );
  console.log(`API call took ${timeTaken} milliseconds.`);

  const documents = searchResult.hits.hits.map((hit) => hit._source);
  console.log("Documents:", documents.length);

  // If no documents found, return a failure response
  if (documents.length === 0) {
    return {
      success: false,
      message: "No documents found for the specified NOVA group(s).",
    };
  }

  let maxLength;

  if (novaGroups.length === 1) {
    const countResult = await client.count({
      index: ES_INDEX,
      body: {
        query: {
          terms: {
            nova_group: novaGroups,
          },
        },
      },
    });
    maxLength = countResult.count;
    console.log("Max Length:", maxLength);
  } else {
    const groupCounts = [];

    for (const group of novaGroups) {
      const countResult = await client.count({
        index: ES_INDEX,
        body: {
          query: {
            term: {
              nova_group: group,
            },
          },
        },
      });
      groupCounts.push({ group, count: countResult.count });
    }

    // Find the group with the highest count
    maxLength = Math.max(...groupCounts.map((group) => group.count));
    console.log("Max Length:", maxLength);
  }

  return {
    success: true,
    documents,
    maxLength: maxLength - from,
    novaGroups,
  };
};

const getUniqueCategories = asyncHandler(async (req, res) => {
  const entriesPerPage = 100;
  let from = 0;

  let uniqueCategories = new Set();

  const query = {
    query: {
      match_all: {},
    },
    size: entriesPerPage,
    from: from,
  };

  const searchResult = await client.search({
    index: ES_INDEX,
    body: query,
  });

  searchResult.hits.hits.forEach((hit) => {
    const categories = hit._source.main_category_en;

    if (categories) {
      Array.isArray(categories)
        ? categories.forEach((category) => uniqueCategories.add(category))
        : uniqueCategories.add(categories);
    }
  });

  from += entriesPerPage;

  const resultCategories = [...uniqueCategories];

  // console.log("Unique Categories:", resultCategories);

  console.log("Number of unique categories:", resultCategories.length);

  res.status(200).json({
    success: true,
    data: {
      categories: resultCategories,
    },
  });
});

const getUniqueBrands = asyncHandler(async (req, res) => {
  const entriesPerPage = 100;
  let from = 0;

  let uniqueBrands = new Set();

  const query = {
    query: {
      match_all: {},
    },
    size: entriesPerPage,
    from: from,
  };

  const searchResult = await client.search({
    index: ES_INDEX,
    body: query,
  });

  searchResult.hits.hits.forEach((hit) => {
    const brands = hit._source.brands;
    if (brands) {
      Array.isArray(brands)
        ? brands.forEach((brand) => uniqueBrands.add(brand))
        : uniqueBrands.add(brands);
    }
  });

  from += entriesPerPage;
  const resultBrands = [...uniqueBrands];

  // console.log("Unique Brands:", resultBrands);

  console.log("Number of unique brands:", resultBrands.length);

  res.status(200).json({
    success: true,
    data: {
      brands: resultBrands,
    },
  });
});

const getUniqueProductNames = asyncHandler(async (req, res) => {
  const entriesPerPage = 100;
  let from = 0;

  let uniqueProductNames = new Set();

  const query = {
    query: {
      match_all: {},
    },
    size: entriesPerPage,
    from: from,
  };

  const searchResult = await client.search({
    index: ES_INDEX,
    body: query,
  });

  searchResult.hits.hits.forEach((hit) => {
    const productName = hit._source.product_name;

    if (productName) {
      uniqueProductNames.add(productName);
    }
  });

  from += entriesPerPage;

  const resultProductNames = [...uniqueProductNames];

  // console.log("Unique Product Names:", resultProductNames);

  console.log("Number of unique product names:", resultProductNames.length);

  res.status(200).json({
    success: true,
    data: {
      productNames: resultProductNames,
    },
  });
});

const getAllData = async (pageNumber, entriesPerPage, from) => {
  const countQuery = {
    query: {
      match_all: {},
    },
  };

  const countResult = await client.count({
    index: ES_INDEX,
    body: countQuery,
  });

  const maxLength = countResult.count;
  console.log("Max Length:", maxLength);

  const searchQuery = {
    query: {
      match_all: {},
    },
    size: entriesPerPage,
    from: from,
  };

  const searchResult = await client.search({
    index: ES_INDEX,
    body: searchQuery,
  });

  console.log(
    "Full Elasticsearch response for all data:",
    JSON.stringify(searchResult, null, 2)
  );

  return {
    success: true,
    documents: searchResult.hits.hits.map((hit) => hit._source),
    maxLength: maxLength - from,
  };
};

const getResultByCategoryBrandProduct = async (
  pageNumber,
  entriesPerPage,
  category,
  brand,
  product,
  from
) => {
  const mustClauses = [];

  if (category) {
    mustClauses.push({ match: { main_category_en: category } });
  }

  if (brand) {
    mustClauses.push({ match: { brands: brand } });
  }

  if (product) {
    mustClauses.push({ match: { product_name: product } });
  }

  if (mustClauses.length === 0) {
    return {
      success: false,
      message: "At least one of category, brand, or product must be provided.",
    };
  }

  const countQuery = {
    query: {
      bool: {
        must: mustClauses,
      },
    },
  };

  const searchQuery = {
    query: {
      bool: {
        must: mustClauses,
      },
    },
    size: entriesPerPage,
    from: from,
  };

  const countResult = await client.count({
    index: ES_INDEX,
    body: countQuery,
  });

  const maxLength = countResult.count;
  console.log("Max Length:", maxLength);

  const searchResult = await client.search({
    index: ES_INDEX,
    body: searchQuery,
  });

  console.log(
    "Full Elasticsearch response for category/brand/product:",
    JSON.stringify(searchResult, null, 2)
  );

  const documents = searchResult.hits.hits.map((hit) => hit._source);

  if (documents.length === 0) {
    return {
      success: false,
      message: "No documents found for the specified query.",
    };
  }

  return {
    success: true,
    documents,
    maxLength: maxLength - from,
    category,
    brand,
    product,
  };
};


const getDocumentById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const searchResult = await client.search({
      index: ES_INDEX,
      body: {
        query: {
          match: {
            _id: id,
          },
        },
      },
    });

    const documents = searchResult.hits.hits.map((hit) => hit._source);

    if (documents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No document found for the specified ID.",
      });
    }

    res.status(200).json({
      success: true,
      data: documents[0],
    });
  } catch (error) {
    console.error("Elasticsearch query error:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while querying Elasticsearch for the specified ID.",
    });
  }
});

// Fetch brand names if category is provided
const getBrandNameByCategory = asyncHandler(async (req, res) => {
  const entriesPerPage = 100;
  let from = 0;
  const category = req.body.categoryName;

  // Set to collect unique brand names
  const brands = new Set();

  const query = {
    query: {
      match: {
        main_category_en: category,
      },
    },
    size: entriesPerPage,
    from: from,
  };

  const searchResult = await client.search({
    index: ES_INDEX,
    body: query,
  });

  // Log the search result for debugging if needed
  console.log("Search Result:", JSON.stringify(searchResult, null, 2));

  // Extract and add brand names to the Set
  searchResult.hits.hits.forEach((hit) => {
    const brandName = hit._source.brands;
    if (brandName) {
      Array.isArray(brandName)
        ? brandName.forEach((brand) => brands.add(brand))
        : brands.add(brandName);
    }
  });

  // Update `from` to fetch the next batch
  from += entriesPerPage;

  // Convert the Set to an array for the response
  const resultBrands = [...brands];

  res.status(200).json({
    success: true,
    data: resultBrands,
  });
});

// Fetch product name if category and brand is provided
const getProductNameByCategoryBrand = asyncHandler(async (req, res) => {
  const entriesPerPage = 100;
  let from = 0;
  const category = req.body.categoryName;
  const brand = req.body.brandName;
  // Set to collect unique brand names
  const products = new Set();

  const query = {
    query: {
      bool: {
        must: [
          { match: { main_category_en: category } },
          { match: { brands: brand } },
        ],
      },
    },
    size: entriesPerPage,
    from: from,
  };

  const searchResult = await client.search({
    index: ES_INDEX,
    body: query,
  });

  // Log the search result for debugging if needed
  console.log("Search Result:", JSON.stringify(searchResult, null, 2));

  // Extract and add brand names to the Set
  searchResult.hits.hits.forEach((hit) => {
    const productName = hit._source.product_name;
    if (productName) {
      Array.isArray(productName)
        ? productName.forEach((product) => products.add(product))
        : products.add(productName);
    }
  });

  // Update `from` to fetch the next batch
  from += entriesPerPage;

  // Convert the Set to an array for the response
  const resultProducts = [...products];

  res.status(200).json({
    success: true,
    data: resultProducts,
  });
});

const searchResult = asyncHandler(async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    console.log("Page Number:", pageNumber);
    const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
    console.log("Entries Per Page:", entriesPerPage);
    const from = (pageNumber - 1) * entriesPerPage;
    const type = req.query.type;
    console.log("Type:", type);
    let data = {};

    // Handling NOVA group query
    if (type === "novaclass") {
      const novaGroup = req.body.novaclass;
      const novaGroups = novaGroup
        ? novaGroup.split(",").map((group) => group.trim())
        : [];

      console.log("Nova Groups:", novaGroups);

      data = await getResultByNovaGroup(
        pageNumber,
        entriesPerPage,
        novaGroups,
        from
      );

      if (!data.success) {
        return res.status(404).json({
          success: false,
          message: "No documents found for the specified NOVA group(s).",
        });
      }
    }

    // Handling category, brand, or product query
    if (type === "category") {
      console.log("Query", req.query);
      console.log("Body", req.body);
      const category = req.body.categoryName;
      console.log("Category:", category);
      const brand = req.body.brandName;
      console.log("Brand:", brand);
      const product = req.body.productName;
      console.log("Product:", product);

      if (!category && !brand && !product) {
        console.log("Fetching all data.");
        data = await getAllData(pageNumber, entriesPerPage, from);
        console.log("Max Length:", data.maxLength);

        if (!data.success) {
          return res.status(404).json({
            success: false,
            message: "No documents found.",
          });
        }
      } else {
        // Use the dynamic query function to handle partial or full inputs
        data = await getResultByCategoryBrandProduct(
          pageNumber,
          entriesPerPage,
          category,
          brand,
          product,
          from
        );

        if (!data.success) {
          return res.status(404).json({
            success: false,
            message: "No documents found for the specified query.",
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        documents: data.documents,
        totalLength: data.maxLength,
        category: data.category || null,
        brand: data.brand || null,
        product: data.product || null,
        novaGroups: data.novaGroups || null,
      },
    });
  } catch (error) {
    console.error("Elasticsearch query error:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while querying Elasticsearch for the specified type.",
    });
  }
});

export { searchResult, getDocumentById, getBrandNameByCategory, getProductNameByCategoryBrand, getUniqueCategories, getUniqueBrands, getUniqueProductNames };
