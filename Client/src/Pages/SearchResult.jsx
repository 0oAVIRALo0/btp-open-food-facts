import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { Table } from "antd";

function SearchResult() {
  const [searchParams] = useSearchParams();
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

    const formData = new URLSearchParams();
    formData.append("novaclass", novaclass);
    formData.append("categoryName", categoryName || "");
    formData.append("brandName", brandName || "");
    formData.append("productName", productName || "");

    axios
      .post(
        `http://localhost:8000/api/v1/search/search-result?type=${type}&pageNumber=${page}&entriesPerPage=${limit}`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
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
            categories_en: data?.categories_en,
            brands: data?.brands,
            nutriscore_grade: data?.nutriscore_grade,
            ecoscore_grade: data?.ecoscore_grade,
            novaClass: data?.nova_group,
            predicted_nova_group: data?.predicted,
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
      title: "Predicted Nova Class",
      dataIndex: "predicted_nova_group",
      key: "predicted",
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
