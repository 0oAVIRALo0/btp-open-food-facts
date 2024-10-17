import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { Table } from 'antd';

function SearchResult() {
  const [searchParams] = useSearchParams();
  const novaclass = searchParams.get("novaclass")?.split(",").map(Number) || [];

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
          novaclass,
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
              product_name: data?.product_name,
              generic_name: data?.generic_name,
              quantity: data?.quantity,
              categories_en: data?.categories_en,
              nutriscore_grade: data?.nutriscore_grade,
              ecoscore_score: data?.ecoscore_score,
              serving_size : data?.serving_size,
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
        title: 'Product Name',
        dataIndex: 'product_name',
        key: 'product_name',
        fixed: 'left',
        render: (text) => <span style={{color: '#638773', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    }, 
    {
        title: 'Genric Name',
        dataIndex: 'generic_name',
        key: 'generic_name',
        fixed: 'left',
        render: (text) => <span style={{color: '#638773', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '250px',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        fixed: 'left',
        render: (text) => <span style={{color: '#638773'}}>{text || '-'}</span>,
        width: '200px',
    },
    {
        title: 'Categories',
        dataIndex: 'categories_en',
        key: 'categories_en',
        render: (text) => <span style={{color: '#638773', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    },
    {
      title: 'Nova Class',
      dataIndex: 'novaClass',
      key: 'novaClass',
      render: (text) => <span style={{color: '#638773', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
      width: '200px',
    },
    {
        title: 'Nutrition Score',
        dataIndex: 'nutriscore_grade',
        key: 'totalFat',
        render: (text) => <span style={{color: '#638773', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    },
    {
        title: 'Ecoscore Score',
        dataIndex: 'ecoscore_score',
        key: 'carbohydrate',
        render: (text) => <span style={{color: '#638773', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
    },
    {
        title: 'Serving Size',
        dataIndex: 'serving_size',
        key: 'serving_size',
        render: (text) => <span style={{color: '#638773', display: 'flex', justifyContent: 'center'}}>{text || '-'}</span>,
        width: '200px',
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
