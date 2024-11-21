import React, { useState, useEffect } from "react";
import {useSearchParams, useNavigate} from "react-router-dom";

import {api, requests} from '../Utility';
import {Filter} from '../Components';

import { Table, Button} from "antd";

const filterIcon = (
  <svg width="20" height="12" viewBox="0 0 25 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H25V2.47059H0V0ZM4.16667 5.76471H20.8333V8.23529H4.16667V5.76471ZM9.16667 11.5294H15.8333V14H9.16667V11.5294Z" fill="#d5ebde"/>
  </svg>
)

function SearchResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // const type = searchParams.get("type");
  const initialSearchParams = {
    productName: searchParams.get("productName") || "",
    brandName: searchParams.get("brandName") || "",
    category: searchParams.get("categoryName") || "",
    novaClass: searchParams.get("novaclass")
      ? searchParams.get("novaclass").split(",").map(Number)
      : [],
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    page: 1,
    limit: 8,
    total: 0,
    searchParams: initialSearchParams,
  });
  const [filterModal, setFilterModal] = useState(false)

  
  const apiCall = (page, limit) => {
    setLoading(true);
    console.log("WTF1", tableParams.searchParams);
    const requestBody = {
      categoryName: tableParams.searchParams.category,
      brandName: tableParams.searchParams.brandName,
      productName: tableParams.searchParams.productName,
      novaClass: tableParams.searchParams.novaClass,
    };
    console.log("WTF2", requestBody)
    api
      .post(
        `${requests.searchResult}?pageNumber=${page}&entriesPerPage=${limit}`,
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
            category: data?.main_category_en,
            brands: data?.brands,
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
  }, [tableParams.page, tableParams.limit, tableParams.searchParams]);
  
  
  
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
      title: "Category",
      dataIndex: "category",
      key: "category",
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
      title: "NOVA Class",
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
            {`NOVA Class ${novaClass}` || "-"}
          </span>
        );
      },
    },
    {
      title: "Predicted NOVA Class",
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
            {`Predicted NOVA Class ${novaClass}` || "-"}
          </span>
        );
      },
    },  
    // {
    //   title: "Country",
    //   dataIndex: "country",
    //   key: "country",
    //   fixed: "left",
    //   width: "150px",
    //   render: (text) => (
    //     <span
    //       style={{
    //         color: "#000",
    //         display: "flex",
    //         justifyContent: "center",
    //       }}
    //     >
    //       {text || "-"}
    //     </span>
    //   ),
    // },  
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
      <div className='features-btn'>
        <Button className='filter-btn' icon={<div className='filter-icon'>{filterIcon}</div>} onClick={()=>setFilterModal(true)}>Filter</Button>
        {filterModal && <Filter open={filterModal} closeFunc={() => setFilterModal(false)} tableParams={tableParams} setTableParams={setTableParams}/>}
      </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          className="data-table"
          rowKey={(record) => record._id}
          scroll={{ x: 0, y: "calc(100vh - 300px)" }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["8", "64", "50", "100"],
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