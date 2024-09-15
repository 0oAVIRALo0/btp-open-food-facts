import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { Table } from 'antd';
import { Container } from "@mui/material";

function SearchResult() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const macroClass = searchParams.get("macroclass");
  const catname = searchParams.get("catname");
  const description = searchParams.get("description");
  const novaclass = searchParams.get("novaclass")?.split(",").map(Number) || [];

  const parseNutrition = (key) =>
    searchParams.get(key)?.split(",").map(parseFloat) || [];

  const nutritionInfo = {
    Protein: parseNutrition("Protein"),
    "Total Fat": parseNutrition("Total Fat"),
    Carbohydrate: parseNutrition("Carbohydrate"),
    "Sugars, total": parseNutrition("Sugars, total"),
    "Fiber, total dietary": parseNutrition("Fiber, total dietary"),
    Calcium: parseNutrition("Calcium"),
    Iron: parseNutrition("Iron"),
    Sodium: parseNutrition("Sodium"),
    "Vitamin D (D2 + D3)": parseNutrition("Vitamin"),
    Cholesterol: parseNutrition("Cholesterol"),
    "Fatty acids, total saturated": parseNutrition("Fatty acids, total saturated"),
    Potassium: parseNutrition("Potassium"),
    Energy: parseNutrition("Energy"),
  };

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
      .post(
        `https://cosylab.iiitd.edu.in/food-processing-db-api/search?page=${page}&pageSize=${limit}`,
        {
          type,
          category: {
            macroclass: macroClass,
            catname,
            Main_food_description: description,
          },
          novaclass,
          nutrients: nutritionInfo,
        }
      )
      .then((res) => {
        const { data: apiData, totalCount } = res.data.payload;
        setData(apiData || []);
        console.log("WTF",apiData);
        let tableData = []
        apiData.map((data) => {
            let obj = {
              _id: data?._id,
              macroClass: data?.macroclass,
              categoryName: data?.catname,
              foodDescription: data?.Main_food_description,
              protein: data?.Protein,
              totalFat: data?.['Total Fat'],
              carbohydrate: data?.Carbohydrate,
              energy: data?.Energy,
              novaClass : data?.novaclass,
            };
            tableData.push(obj);
          });
          
        setData(tableData);
        setTableParams((prev) => ({ ...prev, total: totalCount }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    apiCall(tableParams.page, tableParams.limit);
  }, [tableParams.page, tableParams.limit]);

  const columns = [
    {
        title: 'Macro Class',
        dataIndex: 'macroClass',
        key: 'macroClass',
        fixed: 'left',
        render: (text) => <span style={{color: '#776E9A', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    }, 
    {
        title: 'Category Name',
        dataIndex: 'categoryName',
        key: 'categoryName',
        fixed: 'left',
        render: (text) => <span style={{color: '#776E9A', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '250px',
    },
    {
        title: 'Food Description',
        dataIndex: 'foodDescription',
        key: 'foodDescription',
        fixed: 'left',
        render: (text) => <span style={{color: '#776E9A'}}>{text || '-'}</span>,
        width: '400px',
    },
    {
        title: 'Protein',
        dataIndex: 'protein',
        key: 'protein',
        render: (text) => <span style={{color: '#776E9A', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    },
    {
        title: 'Total Flat',
        dataIndex: 'totalFat',
        key: 'totalFat',
        render: (text) => <span style={{color: '#776E9A', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    },
    {
        title: 'Carbohydrate',
        dataIndex: 'carbohydrate',
        key: 'carbohydrate',
        render: (text) => <span style={{color: '#776E9A', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    },
    {
        title: 'Energy',
        dataIndex: 'energy',
        key: 'energy',
        render: (text) => <span style={{color: '#776E9A', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    },
    {
        title: 'Nova Class',
        dataIndex: 'novaClass',
        key: 'novaClass',
        render: (text) => <span style={{color: '#776E9A', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    },
  ];
  
  const handlePageChange = (page, limit) => {
    setTableParams({ ...tableParams, page, limit });
  };

  return (
    <div className="searcResult-wrapper">
      {/* <h2 style={{ textAlign: "left" }}>Showing all food results</h2> */}
      <div className="container">
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            className="data-table"
            rowKey={(record) => record._id}
            scroll={{ x: 1500, y: 'calc(100vh - 200px)' }}
            pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
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
