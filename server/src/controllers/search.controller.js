import dotenv from "dotenv";

dotenv.config();

import { Client } from "@elastic/elasticsearch";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";

const ES_INDEX = "dataset";

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

  const endTime = new Date(); // End time
  const timeTaken = endTime - startTime; // Time in milliseconds

  console.log(
    "Full Elasticsearch response for nova groups:",
    JSON.stringify(searchResult, null, 2)
  );
  console.log(`API call took ${timeTaken} milliseconds.`);

  const documents = searchResult.hits.hits.map((hit) => hit._source);
  console.log("Documents:", documents.length);
  const maxLength = 10000 - from;

  if (documents.length === 0) {
    return {
      success: false,
      message: "No documents found for the specified NOVA group(s).",
    };
  }

  return {
    success: true,
    documents,
    maxLength,
    novaGroups,
  };
};

const getResultByCategory = async (
  pageNumber,
  entriesPerPage,
  category,
  brand,
  product,
  from
) => {
  const query = {
    query: {
      bool: {
        must: [
          {
            match: {
              categories_en: category,
            },
          },
        ],
      },
    },
    size: entriesPerPage,
    from: from,
  };

  if (brand) {
    query.query.bool.must.push({
      match: {
        brands_tags: brand,
      },
    });
  }

  if (product) {
    query.query.bool.must.push({
      match: {
        product_name: product,
      },
    });
  }

  const searchResult = await client.search({
    index: ES_INDEX,
    body: query,
  });

  console.log(
    "Full Elasticsearch response for categories:",
    JSON.stringify(searchResult, null, 2)
  );

  const documents = searchResult.hits.hits.map((hit) => hit._source);

  if (documents.length === 0) {
    return {
      success: false,
      message: "No documents found for the specified category.",
    };
  }

  return {
    success: true,
    documents,
    category,
    brand,
    product,
  };
};

const getAllData = async (pageNumber, entriesPerPage, from) => {
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

  console.log(
    "Full Elasticsearch response for all data:",
    JSON.stringify(searchResult, null, 2)
  );

  const documents = searchResult.hits.hits.map((hit) => hit._source);
  const maxLength = 10000 - from;

  return {
    success: true,
    documents,
    maxLength,
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
  const mustQueries = [];

  // Add conditions to the query if category, brand, or product is provided
  if (category) {
    mustQueries.push({
      match: {
        categories_en: category,
      },
    });
  }

  if (brand) {
    mustQueries.push({
      match: {
        brands_tags: brand,
      },
    });
  }

  if (product) {
    mustQueries.push({
      match: {
        product_name: product,
      },
    });
  }

  // Construct the Elasticsearch query
  const query = {
    query: {
      bool: {
        must: mustQueries,
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
    "Full Elasticsearch response for category/brand/product:",
    JSON.stringify(searchResult, null, 2)
  );

  const documents = searchResult.hits.hits.map((hit) => hit._source);
  const maxLength = 10000 - from;

  if (documents.length === 0) {
    return {
      success: false,
      message: "No documents found for the specified query.",
    };
  }

  return {
    success: true,
    documents,
    maxLength,
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

const searchResult = asyncHandler(async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const entriesPerPage = parseInt(req.query.entriesPerPage) || 50;
    const from = (pageNumber - 1) * entriesPerPage;
    const type = req.query.type;
    let data = {};

    // Handling NOVA group query
    if (type === "novaclass") {
      const novaGroup = req.body.novaclass;
      const novaGroups = novaGroup
        ? novaGroup.split(",").map((group) => group.trim())
        : [];

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
      const category = req.body.categoryName;
      console.log("Category:", category);
      const brand = req.body.brandName;
      const product = req.body.productName;

      if (!category && !brand && !product) {
        data = await getAllData(pageNumber, entriesPerPage, from);

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

export { searchCategories, searchResult, getDocumentById };

// const query = {
//   query: {
//     bool: {
//       must:
//         novaGroups.length > 0
//           ? [
//               {
//                 terms: {
//                   nova_group: novaGroups,
//                 },
//               },
//             ]
//           : [],
//     },
//   },
//   // Removed size and from
// };
