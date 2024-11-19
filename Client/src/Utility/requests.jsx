const request = {
    predict : `/predict/predict-class`,
    searchUnique: {
        category: `/search/unique-categories`,
        brands: `/search/unique-brands`,
        productName: `/search/unique-product-names`,
    },
    searchBy: {
        category : `/search/getBrandByCategory`,
        categoryAndBrand: `/search/getProductNameByCategory&Brand`
    },
    searchResult: `/search//search-result`,
    searchByID: `/search/document`
  };

  export default request;
  