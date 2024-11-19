import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tooltip } from "antd";

import { api, requests } from "../Utility";

import NOVA1 from "/svg/NOVA1.svg";
import NOVA2 from "/svg/NOVA2.svg";
import NOVA3 from "/svg/NOVA3.svg";
import NOVA4 from "/svg/NOVA4.svg";

function formatString(tags) {
  if (!tags) return "";
  return tags
    .split(",")
    .map((tag) => tag.replace("en:", "").replace(/-/g, " "))
    .map((tag) => tag.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()))
    .join(", ");
}

const novaColors = {
  1: { color: "#638773", backgroundColor: "#d1e0da" },
  2: { color: "#466759", backgroundColor: "#b3c4bb" },
  3: { color: "#e07b7b", backgroundColor: "#f6d1d1" },
  4: { color: "#a14343", backgroundColor: "#dba8a8" },
};

const gradeColors = {
  a: { color: "#638773", backgroundColor: "#d1e0da" },
  b: { color: "#466759", backgroundColor: "#b3c4bb" },
  c: { color: "#e07b7b", backgroundColor: "#f6d1d1" },
  d: { color: "#a14343", backgroundColor: "#dba8a8" },
  e: { color: "#7b2828", backgroundColor: "#c19595" },
};

function SingleProduct() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getNovaImage = (novaClass) => {
    switch (novaClass) {
      case "1":
        return NOVA1;
      case "2":
        return NOVA2;
      case "3":
        return NOVA3;
      case "4":
        return NOVA4;
      default:
        return null;
    }
  };

  const renderBoxes = (data, current, colors) =>
    data.map((item) => {
      const itemStr = item.toString(); 
      const currentStr = current?.toString()?.toLowerCase(); 
      const isActive = itemStr.toLowerCase() === currentStr;
  
      const { color, backgroundColor } = colors[itemStr.toLowerCase()] || {};
      return (
        <div
          key={itemStr}
          className={`box ${isActive ? 'active' : ''}`}
          style={{
            color:  color ,
            backgroundColor: isActive ? backgroundColor : undefined,
            borderColor: color ,
            display: 'flex',
            alignItems: "center"
          }}
        >
          {itemStr.toUpperCase()}
        </div>
      );
    });
  

  const apiCall = () => {
    setLoading(true);
    api
      .get(`${requests.searchByID}/${id}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        setData(res.data.data || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    apiCall();
  }, []);

  if (loading) {
    return <div className="loader-wrapper">Loading...</div>;
  }

  if (!data) {
    return <div className="loader-wrapper">No product data available.</div>;
  }

  return (
    <div className="singleProduct-wrapper">
      <div className="product-card">
        <div className="product-banner">
          <div className="nova-image">
            <img src={getNovaImage(data.nova_group)} alt={`NOVA ${data.nova_group}`} />
          </div>
          <div className="product-details">
            <h2>{data.product_name || "Unknown Product"}</h2>
            <div className="details-list">
              <p>
                <Tooltip title="Bar Code" arrow={false}>
                  <strong>Code: </strong> 
                </Tooltip>
                {data.code || "N/A"}
              </p>
              <p>
                <Tooltip title="Category Name" arrow={false}>
                  <strong>Category:</strong>
                </Tooltip> 
                {data.main_category_en || "N/A"}
              </p>
              <p>
                <Tooltip title="Country of Origin" arrow={false}>
                  <strong>Country:</strong>
                </Tooltip>
                {data.countries_en || "N/A"}
              </p>
              <p>
                <Tooltip title="Number of Additives" arrow={false}>
                  <strong>Additives:</strong>
                </Tooltip> 
                {data.additives_n || "N/A"}
              </p>
              <p>
                <Tooltip title="Food Group" arrow={false}>
                  <strong>Food Group:</strong>
                </Tooltip> 
                {data.food_groups_en || "Unknown"}
              </p>
              <p>
                <Tooltip title="Programme National Nutrition SantÉ Groups" arrow={false}>
                  <strong>PNNS Group 1:</strong> 
                </Tooltip>
                {data.pnns_groups_1 || "Unknown"}
              </p>
              <p>
                <Tooltip title="Programme National Nutrition SantÉ Groups" arrow={false}>
                  <strong>PNNS Group 2:</strong> 
                </Tooltip>
                {data.pnns_groups_2 || "Unknown"}
              </p>
              <p>
                <Tooltip title="Nutrient Level Tags" arrow={false}>
                  <strong>Nutrient Tags:</strong>
                </Tooltip>
                {formatString(data.nutrient_levels_tags) || "Unknown"}
              </p>
              <p>
                <Tooltip title="Ingredient Analysis Tags" arrow={false}>
                <strong>Ingredients:</strong> 
                </Tooltip>{formatString(data.ingredients_analysis_tags) || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="product-card">
        <div className="display-container">
          <div className="category">
            <Tooltip title="A lable that categorizes foods based on their level of processing, ranging from unprocessed (Group 1) to ultra-processed (Group 4).">
              <h3>NOVA Class</h3>
            </Tooltip>
            <div className="box-container">{renderBoxes([1, 2, 3, 4], data.nova_group, novaColors)}</div>
          </div>
         <div className="category">
          <Tooltip title="Predicted NOVA Class by our model.">
            <h3>Predicted NOVA Class</h3>
          </Tooltip>
            <div className="box-container">{renderBoxes([1, 2, 3, 4], data.predicted, novaColors)}</div>
          </div>

         <div className="category">
          <Tooltip title="A label that ranks foods from A (dark green) to E (dark orange) based on their nutritional value" arrow={false}>
            <h3>Nutri-Score</h3>
          </Tooltip>
          <div className="box-container">{renderBoxes(['A', 'B', 'C', 'D', 'E'], data.nutriscore_grade, gradeColors)}</div>
        </div>

        <div className="category">
          <Tooltip title="A label that rates a food product's environmental impact on a scale of A (green, low impact) to E (red, high impact)." arrow={false}>
            <h3>Eco-Score</h3>
          </Tooltip>
          <div className="box-container">{renderBoxes(['A', 'B', 'C', 'D', 'E'], data.ecoscore_grade, gradeColors)}</div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;