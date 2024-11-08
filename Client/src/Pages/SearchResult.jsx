import React, { useState, useEffect } from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import axios from "axios";

import { Table } from "antd";

function SearchResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type");
  const novaclass = searchParams.get("novaclass")?.split(",").map(Number) || [];
  const categoryName = searchParams.get("categoryName");
  const brandName = searchParams.get("brandName");
  const productName = searchParams.get("productName");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const apiCall = (page, limit) => {
    setLoading(true);

    // const formData = new URLSearchParams();
    // formData.append("categoryName", categoryName || "");
    // formData.append("brandName", brandName || "");
    // formData.append("productName", productName || "");

    // const formDataObject = {};
    // formData.forEach((value, key) => {
    //   formDataObject[key] = value;
    // });

    const requestBody = {
      categoryName: categoryName || "",
      brandName: brandName || "",
      productName: productName || "",
      novaclass: novaclass,
    };

    axios
      .post(
        `http://localhost:8000/api/v1/search/search-result?type=${type}&pageNumber=${page}&entriesPerPage=${limit}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log(res.data.data.documents);
        const apiData = res.data.data.documents;
        setData(apiData || []);
        console.log("WTF", apiData);
        let tableData = [];
        apiData.map((data) => {
          let obj = {
            _id: data?._id,
            product_name: data?.product_name,
            novaClass: data?.nova_group,
            predicted: data?.predicted,
            categories_en: data?.categories_en,
            brands: data?.brands,
            nutriscore_grade: data?.nutriscore_grade,
            ecoscore_grade: data?.ecoscore_grade,
          };
          tableData.push(obj);
        });

        setData(tableData);
        setTableParams((prev) => ({
          ...prev,
          total: res.data.data.totalLength,
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // test hardcode data
  // const apiCall = (page, limit) => {
  //   setLoading(true);
  //   const formData = new URLSearchParams();
  //   formData.append("novaclass", novaclass);
  //   formData.append("categoryName", categoryName || "");
  //   formData.append("brandName", brandName || "");
  //   formData.append("productName", productName || "");
  
  //   // Hardcoded data to mock API response
  //   const hardcodedData = [
  //     {
  //       _id: "66d227c7139d49421ee0dbf4",
  //       product_name: "Cranberry salad, congealed",
  //       novaClass: 1,
  //       predictedNovaClass : 4,
  //       macroclass: "Fruit",
  //       categories_en: "Other fruits and fruit salads",
  //       energy: 137,
  //       protein: 2.1,
  //       fat: 4.78,
  //       carbohydrates: 23.36,
  //     },
  //     {
  //       _id: "66d227c7139d49421ee0dbf3",
  //       product_name: "Apple and grape salad with yogurt and walnuts",
  //       novaClass: 2,
  //       predictedNovaClass : 3,
  //       macroclass: "Fruit",
  //       categories_en: "Other fruits and fruit salads",
  //       energy: 117,
  //       protein: 2.15,
  //       fat: 5.05,
  //       carbohydrates: 15.73,
  //     },
  //     {
  //       _id: "66d227c7139d49421ee0dbf2",
  //       product_name: "Fruit cocktail, cooked or canned, juice pack",
  //       novaClass: 3,
  //       predictedNovaClass : 2,
  //       macroclass: "Fruit",
  //       categories_en: "Other fruits and fruit salads",
  //       energy: 46,
  //       protein: 0.46,
  //       fat: 0.01,
  //       carbohydrates: 11.86,
  //     },
  //     {
  //       _id: "66d227c7139d49421ee0dbf1",
  //       product_name: "Fruit cocktail, cooked or canned, drained solids",
  //       novaClass: 4,
  //       predictedNovaClass : 1,
  //       macroclass: "Fruit",
  //       categories_en: "Other fruits and fruit salads",
  //       energy: 70,
  //       protein: 0.47,
  //       fat: 0.1,
  //       carbohydrates: 18.8,
  //     },
  //     {
  //       _id: "66d227c7139d49421ee0dbf0",
  //       product_name: "Tropical fruit cocktail, cooked or canned, in light syrup",
  //       novaClass: 2,
  //       predictedNovaClass : 3,
  //       macroclass: "Fruit",
  //       categories_en: "Other fruits and fruit salads",
  //       energy: 50,
  //       protein: 0.37,
  //       fat: 0.17,
  //       carbohydrates: 12.69,
  //     },
  //     // Add more objects as needed for the hardcoded mock data
  //   ];
  
  //   // Simulating the table data extraction process
  //   let tableData = [];
  //   hardcodedData.map((data) => {
  //     let obj = {
  //       _id: data._id,
  //       product_name: data.product_name,
  //       novaClass: data.novaClass,
  //       macroclass: data.macroclass,
  //       categories_en: data.categories_en,
  //       energy: data.energy,
  //       protein: data.protein,
  //       fat: data.fat,
  //       carbohydrates: data.carbohydrates,
  //       predictedNovaClass : data.predictedNovaClass
  //     };
  //     tableData.push(obj);
  //   });
  
  //   // Simulating response handling
  //   setTimeout(() => {
  //     setData(tableData);
  //     setTableParams((prev) => ({
  //       ...prev,
  //       total: hardcodedData.length, // Hardcoded total length
  //     }));
  //     setLoading(false); // Simulate end of loading
  //   }, 1000); // Simulate some delay to mimic actual API call time
  // };
  
  
  useEffect(() => {
    apiCall(tableParams.page, tableParams.limit);
  }, [tableParams.page, tableParams.limit]);
  
  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      fixed: "left",
      width: "200px",
      render: (text, record) => {
        return (
          <span
            onClick={() => {
               navigate(`/food-product-detail?id=${record._id}`);
             }}
            style={{
              color: "#638773",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer", 
            }}
          >
            {text || "-"}
          </span>
        );
      },
    },
    {
      title: "Brand Name",
      dataIndex: "brands",
      key: "brands",
      // fixed: "left",
      render: (text) => (
        <span
          style={{
            color: "#638773",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text || "-"}
        </span>
      ),
      width: "250px",
    },
    {
      title: "Categories",
      dataIndex: "categories_en",
      key: "categories_en",
      render: (text) => (
        <span
          style={{
            color: "#638773",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text || "-"}
        </span>
      ),
      width: "200px",
    },
    {
      title: "Nova Class",
      dataIndex: "novaClass",
      key: "novaClass",
      render: (text) => {
        let color;
        // console.log(typeof text);
        
        switch (text) {
          case 1:
            color = "#638773"; 
            break;
          case 2:
            color = "#466759"; 
            break;
          case 3:
            color = "#e07b7b"; 
            break;
          case 4:
            color = "#a14343"; 
            break;
          default:
            color = "#000"; 
        }
        
        return (
          <span
            style={{
              color: color,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {`Nova Class ${text}` || "-"}
          </span>
        );
      },
      width: "200px",
    },
    {
      title: "Predicted Nova Class",
      dataIndex: "predicted",
      key: "predicted",
      render: (text) => {
        let color, backgroundColor;
    
        switch (text) {
          case 1:
            color = "#638773";
            backgroundColor = "#d1e0da"; 
            break;
          case 2:
            color = "#466759"; 
            backgroundColor = "#b3c4bb"; 
            break;
          case 3:
            color = "#e07b7b"; 
            backgroundColor = "#f6d1d1"; 
            break;
          case 4:
            color = "#a14343"; 
            backgroundColor = "#dba8a8"; 
            break;
          default:
            color = "#000"; 
            backgroundColor = "#fff"; 
        }
    
        return (
          <span
            style={{
              color: color,
              backgroundColor: backgroundColor,
              display: "flex",
              justifyContent: "center",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            {`Predicted Nova Class ${text}` || "-"}
          </span>
        );
      },
      width: "200px",
    },    
    {
      title: "Nutrition Score",
      dataIndex: "nutriscore_grade",
      key: "totalFat",
      render: (text) => (
        <span
          style={{
            color: "#638773",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text || "-"}
        </span>
      ),
      width: "200px",
    },
    {
      title: "Ecoscore Grade",
      dataIndex: "ecoscore_grade",
      key: "ecoscore_grade",
      render: (text) => (
        <span
          style={{
            color: "#638773",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text || "-"}
        </span>
      ),
      width: "200px",
    },
  ];

  // test hardocode data
  // const columns = [
  //   {
  //     title: "Product Name",
  //     dataIndex: "product_name",
  //     key: "product_name",
  //     fixed: "left",
  //     width: "200px",
  //     render: (text, record) => {
  //       return (
  //         <span
  //           onClick={() => {
  //             navigate(`/food-product-detail?id=${record._id}`);
  //           }}
  //           style={{
  //             color: "#638773",
  //             display: "flex",
  //             justifyContent: "center",
  //             cursor: "pointer",
  //           }}
  //         >
  //           {text || "-"}
  //         </span>
  //       );
  //     },
  //   },
  //   {
  //     title: "Nova Class",
  //     dataIndex: "novaClass",
  //     key: "novaClass",
  //     render: (text) => {
  //       let color;
        
  //       switch (text) {
  //         case 1:
  //           color = "#638773"; 
  //           break;
  //         case 2:
  //           color = "#466759"; 
  //           break;
  //         case 3:
  //           color = "#e07b7b"; 
  //           break;
  //         case 4:
  //           color = "#a14343"; 
  //           break;
  //         default:
  //           color = "#000"; 
  //       }
        
  //       return (
  //         <span
  //           style={{
  //             color: color,
  //             display: "flex",
  //             justifyContent: "center",
  //           }}
  //         >
  //           {`Nova Class ${text}` || "-"}
  //         </span>
  //       );
  //     },
  //     width: "200px",
  //   },
  //   {
  //     title: "Predicted Nova Class",
  //     dataIndex: "predictedNovaClass",
  //     key: "predictedNovaClass",
  //     render: (text) => {
  //       let color, backgroundColor;
    
  //       switch (text) {
  //         case 1:
  //           color = "#638773";
  //           backgroundColor = "#d1e0da"; 
  //           break;
  //         case 2:
  //           color = "#466759"; 
  //           backgroundColor = "#b3c4bb"; 
  //           break;
  //         case 3:
  //           color = "#e07b7b"; 
  //           backgroundColor = "#f6d1d1"; 
  //           break;
  //         case 4:
  //           color = "#a14343"; 
  //           backgroundColor = "#dba8a8"; 
  //           break;
  //         default:
  //           color = "#000"; 
  //           backgroundColor = "#fff"; 
  //       }
    
  //       return (
  //         <span
  //           style={{
  //             color: color,
  //             backgroundColor: backgroundColor,
  //             display: "flex",
  //             justifyContent: "center",
  //             padding: "5px 10px",
  //             borderRadius: "5px",
  //           }}
  //         >
  //           {`Predicted Nova Class ${text}` || "-"}
  //         </span>
  //       );
  //     },
  //     width: "200px",
  //   },   
  //   {
  //     title: "Category",
  //     dataIndex: "categories_en",
  //     key: "categories_en",
  //     width: "200px",
  //     render: (text) => <span>{text || "-"}</span>,
  //   },
  //   {
  //     title: "Energy (kcal)",
  //     dataIndex: "energy",
  //     key: "energy",
  //     width: "120px",
  //     render: (text) => <span>{text || "-"}</span>,
  //   },
  //   {
  //     title: "Protein (g)",
  //     dataIndex: "protein",
  //     key: "protein",
  //     width: "120px",
  //     render: (text) => <span>{text || "-"}</span>,
  //   },
  //   {
  //     title: "Total Fat (g)",
  //     dataIndex: "fat",
  //     key: "fat",
  //     width: "120px",
  //     render: (text) => <span>{text || "-"}</span>,
  //   },
  //   {
  //     title: "Carbohydrates (g)",
  //     dataIndex: "carbohydrates",
  //     key: "carbohydrates",
  //     width: "150px",
  //     render: (text) => <span>{text || "-"}</span>,
  //   },
  // ];
  
  const handlePageChange = (page, limit) => {
    setTableParams({ ...tableParams, page, limit });
  };

  return (
    <div className="searcResult-wrapper">
      <div className="container">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          className="data-table"
          rowKey={(record) => record._id}
          scroll={{ x: 1500, y: "calc(100vh - 200px)" }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            current: tableParams.page,
            pageSize: tableParams.limit,
            total: tableParams.total,
            onChange: handlePageChange,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>
    </div>
  );
}

export default SearchResult;


// /searchResult?type=category&macroclass=Fruit&catname=&description=&novaclass=&Protein=0,14.26&Total%20Fat=0,25.05&Carbohydrate=2.19,59.25&Sugars,%20total=0,31.5&Fiber,%20total%20dietary=0,6.21&Calcium=0,283.17&Iron=0,9.07&Sodium=0,1171.91&Vitamin=0,2.1&Cholesterol=0,62.7&Fatty%20acids,%20total%20saturated=0,8.71&Potassium=0,518.72&Energy=57.82,408.16