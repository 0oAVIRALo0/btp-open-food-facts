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

    const requestBody = {
      categoryName: categoryName || "",
      brandName: brandName || "",
      productName: productName || "",
      novaClass: novaclass || "",
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
        const apiData = res.data.data.documents;
        setData(apiData || []);
        let tableData = [];
        apiData.map((data) => {
          let obj = {
            _id: data?.code,
            product_name: data?.product_name,
            novaClass: data?.nova_group,
            predictedNoveClass: data?.predicted,
            categories: data?.main_category_en,
            brands: data?.brands,
            country: data?.countries_en,
            // nutriscore_grade: data?.nutriscore_grade,
            // ecoscore_grade: data?.ecoscore_grade,
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

  useEffect(() => {
    apiCall(tableParams.page, tableParams.limit);
  }, [tableParams.page, tableParams.limit]);
  
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
      fixed: "left",
      width: "180px",
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
    // {
    //   title: "Nutrition Score",
    //   dataIndex: "nutriscore_grade",
    //   key: "nutriscore_grade",
    //   width: "200px",
    //   render: (text) => (
    //     <span
    //       style={{
    //         color: "#638773",
    //         display: "flex",
    //         justifyContent: "center",
    //       }}
    //     >
    //       {text || "-"}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Ecoscore Grade",
    //   dataIndex: "ecoscore_grade",
    //   key: "ecoscore_grade",
    //   width: "200px",
    //   render: (text) => (
    //     <span
    //       style={{
    //         color: "#638773",
    //         display: "flex",
    //         justifyContent: "center",
    //       }}
    //     >
    //       {text || "-"}
    //     </span>
    //   ),
    // },
  ];

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