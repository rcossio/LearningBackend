import cartDAO from "../data/mongo/dao/cartDAO.js";
import productDAO from "../data/mongo/dao/productDAO.js";

export const getCartById = async (cartId) => {
    return await cartDAO.getCartById(cartId);
};

export const addProductToCart = async (cartId, productId, quantity, productDAO) => {
    return await cartDAO.addProductToCart(cartId, productId, quantity, productDAO);
};

//SOME ARE REPEATED!!!!
export const createNewCart = async () => {
    return await cartDAO.createCart();
};

export const fetchCartById = async (cartId) => {
    return await cartDAO.getCartById(cartId);
};

export const modifyCart = async (cartId, products) => {
    return await cartDAO.updateCart(cartId, products);
};

export const removeCart = async (cartId) => {
    return await cartDAO.deleteCart(cartId);
};

export const addProductToUserCart = async (cartId, productId) => {
    return await cartDAO.addProductToCart(cartId, productId, 1, productDAO);
};

export const updateProductQuantityInCart = async (cartId, productId, quantity) => {
    return await cartDAO.updateProductInCart(cartId, productId, quantity);
};

export const removeProductFromUserCart = async (cartId, productId) => {
    return await cartDAO.deleteProductFromCart(cartId, productId);
};
