import dotenv from "dotenv";

dotenv.config();

import { Client } from "@elastic/elasticsearch";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";

const ES_INDEX = "open-food-facts-search-data-2024.09.16";
const columnNames = [
  "Food_code",
  "Protein,Total",
  "Fat",
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
  "Energy",
  "Main_food_description",
  "catnumb",
  "catname",
  "novaclass",
  "macroclass",
];

const client = new Client({
  node: process.env.ES_NODE,
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  tls: {
    ca: fs.readFileSync(process.env.ES_TLS_CERT),
    rejectUnauthorized: false,
  },
});

const searchMacroClass = asyncHandler(async (req, res) => {
  try {
    const searchResult = await client.search({
      index: ES_INDEX,
      size: 0,
      body: {
        aggs: {
          unique_macroclass: {
            terms: {
              field: "macroclass.keyword",
              size: 10000,
            },
          },
        },
      },
    });

    console.log(
      "Full Elasticsearch response:",
      JSON.stringify(searchResult, null, 2)
    );

    let uniqueMacroclasses;
    if (searchResult.aggregations) {
      uniqueMacroclasses =
        searchResult.aggregations.unique_macroclass.buckets.map(
          (bucket) => bucket.key
        );
      console.log("Unique macroclass values:", uniqueMacroclasses);
    } else {
      console.log("No aggregations found in the response");
    }

    res.status(200).json({
      success: true,
      data: {
        uniqueMacroclasses: uniqueMacroclasses,
      },
    });
  } catch (error) {
    console.error("Elasticsearch query error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while querying Elasticsearch",
    });
  }
});

const searchCategoryName = asyncHandler(async (req, res) => {
  try {
    const { macroClass } = req.body;

    const searchResult = await client.search({
      index: ES_INDEX,
      size: 0,
      body: {
        query: {
          bool: {
            filter: [{ term: { "macroclass.keyword": macroClass } }],
          },
        },
        aggs: {
          unique_catname: {
            terms: {
              field: "catname.keyword",
              size: 10000,
            },
          },
        },
      },
    });

    console.log(
      "Full Elasticsearch response:",
      JSON.stringify(searchResult, null, 2)
    );

    let uniqueCategoryNames;
    if (searchResult.aggregations) {
      uniqueCategoryNames =
        searchResult.aggregations.unique_catname.buckets.map(
          (bucket) => bucket.key
        );
      console.log("Unique categories values:", uniqueCategoryNames);
    } else {
      console.log("No aggregations found in the response");
    }

    res.status(200).json({
      success: true,
      data: {
        uniqueCategoryNames: uniqueCategoryNames || [],
      },
    });
  } catch (error) {
    console.error("Elasticsearch query error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while querying Elasticsearch",
    });
  }
});

const searchFoodDescription = asyncHandler(async (req, res) => {
  try {
    const { categoryName } = req.body;

    const searchResult = await client.search({
      index: ES_INDEX,
      size: 0,
      body: {
        query: {
          bool: {
            filter: [{ term: { "catname.keyword": categoryName } }],
          },
        },
        aggs: {
          food_descriptions: {
            terms: {
              field: "Main_food_description.keyword",
              size: 10000,
            },
          },
        },
      },
    });

    console.log(
      "Full Elasticsearch response:",
      JSON.stringify(searchResult, null, 2)
    );

    let foodDescriptions;
    if (searchResult.aggregations) {
      foodDescriptions =
        searchResult.aggregations.food_descriptions.buckets.map(
          (bucket) => bucket.key
        );
      console.log("Food descriptions:", foodDescriptions);
    } else {
      console.log("No aggregations found in the response");
    }

    res.status(200).json({
      success: true,
      data: {
        foodDescriptions: foodDescriptions || [],
      },
    });
  } catch (error) {
    console.error("Elasticsearch query error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while querying Elasticsearch",
    });
  }
});

const searchNutrients = asyncHandler(async (req, res) => {
  try {
    const { macroClass, categoryName, foodDescription } = req.body;

    const searchResult = await client.search({
      index: ES_INDEX,
      body: {
        query: {
          bool: {
            must: [
              macroClass
                ? { term: { "macroclass.keyword": macroClass } }
                : null,
              categoryName
                ? { term: { "catname.keyword": categoryName } }
                : null,
              foodDescription
                ? { term: { "Main_food_description.keyword": foodDescription } }
                : null,
            ].filter(Boolean),
          },
        },
      },
    });

    console.log(
      "Full Elasticsearch response:",
      JSON.stringify(searchResult, null, 2)
    );

    const hits = searchResult.hits.hits;

    const nutrientDetails = hits.map((hit) => {
      const nutrients = {};
      for (const column of columnNames) {
        if (hit._source[column] !== undefined) {
          nutrients[column] = hit._source[column];
        }
      }
      return nutrients;
    });

    console.log("Nutrient details: ", nutrientDetails);

    res.status(200).json({
      success: true,
      data: {
        nutrientDetails: nutrientDetails,
      },
    });
  } catch (error) {
    console.error("Elasticsearch query error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while querying Elasticsearch",
    });
  }
});

export {
  searchMacroClass,
  searchCategoryName,
  searchFoodDescription,
  searchNutrients,
};
