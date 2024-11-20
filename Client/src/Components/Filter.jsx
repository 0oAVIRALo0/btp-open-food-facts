import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

function Filter({open,closeFunc, tableParams, setTableParams}) {
  const [filterValues, setFilterValues] = useState({
    productName: tableParams.searchParams.productName,
    brandName: tableParams.searchParams.brandName,
    category: tableParams.searchParams.category,
    // novaClass: tableParams.searchParams.novaClass,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setTableParams((prev) => ({
      ...prev,
      searchParams: { ...filterValues },
    }));
    console.log("WTF", tableParams)
    closeFunc();
  };

  const handleReset = () => {
    setFilterValues({
      productName: '',
      brandName: '',
      category: '',
      novaClass: '',
    });
  };

return (
    <Modal
      title="Filter"
      open={open}
      onCancel={closeFunc}
      footer={null}
      className="filter-modal"
    >
      <div className="filter-form">
        <div className="filter-input">
          <label>Category</label>
          <Input
            name="category"
            value={filterValues.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </div>
        <div className="filter-input">
          <label>Brand Name</label>
          <Input
            name="brandName"
            value={filterValues.brandName}
            onChange={handleChange}
            placeholder="Enter brand name"
          />
        </div>
        <div className="filter-input">
          <label>Product Name</label>
          <Input
            name="productName"
            value={filterValues.productName}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </div>
        {/* <div className="filter-input">
          <label>NOVA Class</label>
          <Input
            name="novaClass"
            value={filterValues.novaClass}
            onChange={handleChange}
            placeholder="Enter NOVA class"
          />
        </div> */}
      </div>
      <div className="filter-actions">
        <Button onClick={handleReset} className="reset-button">
          Reset
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Apply Filter
        </Button>
    </div>
    </Modal>
  )
}

export default Filter
