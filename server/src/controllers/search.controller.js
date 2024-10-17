import dotenv from "dotenv";

dotenv.config();

import { Client } from "@elastic/elasticsearch";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";

const ES_INDEX = "open-food-facts-dataset-2024.10.16";

const client = new Client({
  node: process.env.ES_NODE,
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    apiKey: process.env.ES_API_KEY,
  },
  tls: {
    ca: fs.readFileSync(
      "/Users/aviralchauhan/aws-es-kibana/elasticsearch-8.15.1/config/certs/http_ca.crt"
    ),
    rejectUnauthorized: false,
  },
});

const searchCategories = asyncHandler(async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const entriesPerPage = parseInt(req.query.entriesPerPage) || 50;
    const from = (pageNumber - 1) * entriesPerPage;

    // fetch the specific entries for the requested page
    const searchResult = await client.search({
      index: ES_INDEX,
      size: entriesPerPage,
      from: from,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    console.log(
      "Full Elasticsearch response for documents:",
      JSON.stringify(searchResult, null, 2)
    );

    // Extract the documents for the current page
    const documents = searchResult.hits.hits.map((hit) => hit._source);

    // Now, get unique categories from the documents for this page
    const uniqueCategoriesSet = new Set();
    documents.forEach((doc) => {
      if (Array.isArray(doc.categories_en)) {
        doc.categories_en.forEach((category) =>
          uniqueCategoriesSet.add(category.trim())
        );
      } else {
        uniqueCategoriesSet.add(doc.categories_en.trim());
      }
    });

    const uniqueCategories = Array.from(uniqueCategoriesSet);

    res.status(200).json({
      success: true,
      data: {
        uniqueCategories,
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

const searchNovaGroups = asyncHandler(async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const entriesPerPage = parseInt(req.query.entriesPerPage) || 50;
    const from = (pageNumber - 1) * entriesPerPage;

    const novaGroup = req.query.novaGroup;
    console.log("novaGroup:", novaGroup);
    const novaGroups = novaGroup ? novaGroup.split(",").map(Number) : [];
    console.log("novaGroups:", novaGroups);

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

    console.log(
      "Full Elasticsearch response for nova groups:",
      JSON.stringify(searchResult, null, 2)
    );

    const documents = searchResult.hits.hits.map((hit) => hit._source);

    if (documents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No documents found for the specified NOVA group(s).",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        documents,
        totalCount: documents.length,
      },
    });
  } catch (error) {
    console.error("Elasticsearch query error:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while querying Elasticsearch for NOVA groups.",
    });
  }
});

const searchAll = asyncHandler(async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const entriesPerPage = parseInt(req.query.entriesPerPage) || 50;
    const from = (pageNumber - 1) * entriesPerPage;

    const searchResult = await client.search({
      index: ES_INDEX,
      size: entriesPerPage,
      from: from,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    console.log(
      "Full Elasticsearch response for documents:",
      JSON.stringify(searchResult, null, 2)
    );

    // Extract the documents for the current page
    const documents = searchResult.hits.hits.map((hit) => hit._source);

    res.status(200).json({
      success: true,
      data: {
        documents: documents,
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

export { searchCategories, searchNovaGroups, searchAll };
