import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { Table } from "antd";

function SingleProduct() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const apiCall = (page, limit) => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/v1/search/document/${id}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        const apiData = res.data.data;
        setData(apiData || []);
        console.log("WTF", apiData);
        let tableData = [];
        let obj = {
          _id: apiData?.code,
          product_name: apiData?.product_name,
          novaClass: apiData?.nova_group,
          predictedNoveClass: apiData?.predicted,
          categories: apiData?.main_category_en,
          brands: apiData?.brands,
          country: apiData?.countries_en,
          nutriscore_grade: apiData?.nutriscore_grade,
          ecoscore_grade: apiData?.ecoscore_grade,
          ingredients_analysis : apiData?.ingredients_analysis_tags,
          additives : apiData?.additives_n,
          pnns_groups_1: apiData?.pnns_groups_1,
          pnns_groups_2: apiData?.pnns_groups_2,
          food_groups : apiData?.food_groups_en,
          nutrient_levels: apiData?.nutrient_levels_tags,
          completeness: apiData?.completeness,
          nutrition_100g: apiData?.["nutrition-score-fr_100g"],
        };
        console.log("WTF", )
        tableData.push(obj);

        setData(tableData);
        setTableParams((prev) => ({
          ...prev,
          total: res.data.data.totalCount,
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    apiCall(tableParams.page, tableParams.limit);
  }, [tableParams.page, tableParams.limit]);

  const handlePageChange = (page, limit) => {
    setTableParams({ ...tableParams, page, limit });
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      fixed: "left",
      width: "180px",
      render: (text, record) => {
        return (
          <span
            onClick={() => {
               navigate(`/food-product-detail?id=${record._id}`);
             }}
            style={{
              color: "#000",
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
      fixed: "left",
      width: "180px",
      render: (text) => (
        <span
          style={{
            color: "#000",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      fixed: "left",
      width: "150px",
      render: (text) => (
        <span
          style={{
            color: "#000",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Nova Class",
      dataIndex: "novaClass",
      key: "novaClass",
      fixed: "left",
      width: "140px",
      render: (text) => {
        let color;
        const novaClass = Number(text);
        
        switch (novaClass) {
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
              fontWeight: "bold"
            }}
          >
            {`Nova Class ${novaClass}` || "-"}
          </span>
        );
      },
    },
    {
      title: "Predicted Nova Class",
      dataIndex: "predictedNoveClass",
      key: "predictedNoveClass",
      width: "300px",
      render: (text) => {
        let color, backgroundColor;
        const novaClass = parseInt(text, 10);
    
        switch (novaClass) {
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
            {`Predicted Nova Class ${novaClass}` || "-"}
          </span>
        );
      },
    },  
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: "150px",
      render: (text) => (
        <span
          style={{
            color: "#000",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text || "-"}
        </span>
      ),
    },  
    {
      title: "Nutrition Score",
      dataIndex: "nutriscore_grade",
      key: "nutriscore_grade",
      width: "200px",
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
    },
    {
      title: "Ecoscore Grade",
      dataIndex: "ecoscore_grade",
      key: "ecoscore_grade",
      width: "200px",
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
    },
    {
      title: "Ingredients Analysis",
      dataIndex: "ingredients_analysis",
      key: "ingredients_analysis",
      width: "200px",
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
    },
    {
      title: "Additive",
      dataIndex: "additives",
      key: "additives",
      width: "200px",
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
    },
    {
      title: "PNN Group 1",
      dataIndex: "pnns_groups_1",
      key: "pnns_groups_1",
      width: "200px",
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
    },
    {
      title: "PNN Group 2",
      dataIndex: "pnns_groups_2",
      key: "pnns_groups_2",
      width: "200px",
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
    },
    {
      title: "Food Group",
      dataIndex: "food_groups",
      key: "food_groups",
      width: "200px",
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
    },
    {
      title: "Nutrient Levels",
      dataIndex: "nutrient_levels",
      key: "nutrient_levels",
      width: "200px",
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
    },
    {
      title: "Completeness",
      dataIndex: "completeness",
      key: "completeness",
      width: "200px",
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
    },
    {
      title: "Nutrition Per 100g",
      dataIndex: "nutrition_100g",
      key: "nutrition_100g",
      width: "200px",
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
    },
  ];

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

export default SingleProduct;
