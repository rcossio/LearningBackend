import productDAO from "../data/mongo/dao/productDAO.js";

export const getProducts = async (filter, options) => {
    return await productDAO.getProducts(filter, options);
};

//Repeated!!!
export const getAllProducts = async (filter, options) => {
  return await productDAO.getProducts(filter, options);
};

export const getProductById = async (productId) => {
  return await productDAO.getProductById(productId);
};

export const deleteProduct = async (productId) => {
  return await productDAO.deleteProduct(productId);
};

export const addNewProduct = async (product) => {
  return await productDAO.addProduct(product);
};

export const modifyProduct = async (productId, product) => {
  return await productDAO.updateProduct(productId, product);
};