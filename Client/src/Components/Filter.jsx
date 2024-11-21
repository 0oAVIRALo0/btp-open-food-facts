import React, { useState } from 'react';
import { Modal, Input, Button, Checkbox} from 'antd';

const novaOptions = [
  { value: '1', label: 'NOVA Class 1', color: '#638773' },
  { value: '2', label: 'NOVA Class 2', color: '#466759' },
  { value: '3', label: 'NOVA Class 3', color: '#e07b7b' },
  { value: '4', label: 'NOVA Class 4', color: '#a14343' },
];

function Filter({open,closeFunc, tableParams, setTableParams}) {
  const [selectedFilter, setSelectedFilter] = useState('category');
  const [filterValues, setFilterValues] = useState({
    productName: tableParams.searchParams.productName,
    brandName: tableParams.searchParams.brandName,
    category: tableParams.searchParams.category,
    novaClass: tableParams.searchParams.novaClass,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checkedValues) => {
    setFilterValues((prev) => ({
      ...prev,
      novaClass: checkedValues,
    }));
  };
  
  const handleSubmit = () => {
    console.log("Filter Values on Submit:", filterValues);
    setTableParams((prev) => ({
      ...prev,
      searchParams: { ...filterValues },
    }));
    closeFunc();
  };
  
  

  // const handleCheckboxChange = (checkedValues) => {
  //   setFilterValues((prev) => ({
  //     ...prev,
  //     novaClass: checkedValues,
  //   }));
  
  //   // Immediately update `tableParams` with the new `novaClass` values
  //   setTableParams((prev) => ({
  //     ...prev,
  //     searchParams: {
  //       ...prev.searchParams,
  //       novaClass: checkedValues,
  //     },
  //   }));
  
  //   console.log("WTF1", checkedValues);
  // };
  
  // const handleSubmit = () => {
  //   console.log("WTF2", tableParams.searchParams);
  
  //   // Update tableParams with all filter values on form submission
  //   setTableParams((prev) => ({
  //     ...prev,
  //     searchParams: { ...filterValues },
  //   }));
  
  //   closeFunc();
  // };
  

  const handleReset = () => {
    const resetValues = {
      productName: '',
      brandName: '',
      category: '',
      novaClass: [],
    };
    setFilterValues(resetValues); 
    setTableParams((prev) => ({
      ...prev,
      searchParams: resetValues, 
    }));
    closeFunc();
  };

  const renderFilterInput = () => {
    switch (selectedFilter) {
      case 'productName':
        return (
          <>
            <label>Enter Product Name</label>
            <Input
              name="productName"
              value={filterValues.productName}
              onChange={handleChange}
              placeholder="Product name"
            />
          </>
        );
      case 'brandName':
        return (
          <>
            <label>Enter Brand name</label>
            <Input
              name="brandName"
              value={filterValues.brandName}
              onChange={handleChange}
              placeholder="Brand name"
            />
          </>
        );
      case 'category':
        return (
          <>
          <label>Enter Category Name</label>
            <Input
              name="category"
              value={filterValues.category}
              onChange={handleChange}
              placeholder="Category Name"
            />
          </>
        );
      case 'novaClass':
        return (
          <>
          <label>Choose NOVA Class</label>
            <Checkbox.Group
              value={filterValues.novaClass}
              onChange={handleCheckboxChange}
              className="nova-class-checkboxes"
            >
              {novaOptions.map((opt) => (
                <div key={opt.value} className="nova-checkbox-item">
                  <Checkbox value={opt.value}>
                    <span style={{ color: opt.color, fontSize: '11px' }}>
                      {opt.label}
                    </span>
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <Modal
      title="Filter Products"
      open={true}
      onCancel={closeFunc}
      footer={null}
      className="filter-modal"
    >
      <div className="filter-layout">
        <div className="filter-sidebar">
          <ul>
            <li
              className={selectedFilter === 'category' ? 'active' : ''}
              onClick={() => setSelectedFilter('category')}
            >
              Category
            </li>
            <li
              className={selectedFilter === 'brandName' ? 'active' : ''}
              onClick={() => setSelectedFilter('brandName')}
            >
              Brand Name
            </li>
            <li
              className={selectedFilter === 'productName' ? 'active' : ''}
              onClick={() => setSelectedFilter('productName')}
            >
              Product Name
            </li>
            <li
              className={selectedFilter === 'novaClass' ? 'active' : ''}
              onClick={() => setSelectedFilter('novaClass')}
            >
              NOVA Class
            </li>
          </ul>
        </div>
        <div className="filter-content">
          {renderFilterInput()}
        </div>
      </div>
      <div className="filter-actions">
        <Button onClick={handleReset} className="btn">
          Reset
        </Button>
        <Button type="primary" onClick={handleSubmit} className="btn">
          Apply Filter
        </Button>
      </div>
    </Modal>
  );
}

export default Filter
