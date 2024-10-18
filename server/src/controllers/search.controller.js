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
    return {
      success: false,
      message: "No documents found for the specified NOVA group(s).",
    };
  }

  return {
    success: true,
    documents,
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

const searchResult = asyncHandler(async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const entriesPerPage = parseInt(req.query.entriesPerPage) || 50;
    const from = (pageNumber - 1) * entriesPerPage;
    const type = req.params.type;
    let data;

    if (type === "novaGroup") {
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

    if (type === "category") {
      const category = req.body.category;
      const brand = req.body.brand;
      const product = req.body.product;

      data = await getResultByCategory(
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
          message: "No documents found for the specified category.",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        documents: data.documents,
        category: data.category,
        brand: data.brand,
        product: data.product,
        novaGroups: data.novaGroups,
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

export { searchCategories, searchResult };

// const apiCall = (page, limit) => {
//     setLoading(true);

//     // Create form data in URL-encoded format
//     const formData = new URLSearchParams();
//     formData.append("novaclass", novaclass);

//     axios
//       .post(
//         `http://localhost:8000/api/v1/search/search-result?type=${}pageNumber=${page}&entriesPerPage=${limit}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         }
//       )
//       .then((res) => {
//         const apiData = res.data.data.documents;
//         setData(apiData || []);
//         console.log("WTF", apiData);
//         let tableData = [];
//         apiData.map((data) => {
//           let obj = {
//             _id: data?._id,
//             product_name: data?.product_name,
//             generic_name: data?.generic_name,
//             quantity: data?.product_quantity,
//             categories_en: data?.categories_en,
//             nutriscore_grade: data?.nutriscore_grade,
//             ecoscore_score: data?.ecoscore_score,
//             serving_size: data?.serving_size,
//             novaClass: data?.nova_group,
//           };
//           tableData.push(obj);
//         });

//         setData(tableData);
//         setTableParams((prev) => ({
//           ...prev,
//           total: res.data.data.totalCount,
//         }));
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   };
