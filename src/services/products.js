import {productDAO} from "../data/factory.js";
import logError from "../utils/errorHandler.js";
import CustomError from "./customError.js";

class ProductsService {

    static async getProducts(filter, options) {
        return await productDAO.getProducts(filter, options);
    }

    static async getProductById(productId) {
        try {
            return await productDAO.getProductById(productId);
        } catch (error) {
            logError(error);
            throw error;
        }
    }

    static async deleteProduct(productId, ownerEmail = null) {
        if (ownerEmail) {
            const product = await productDAO.getProductById(productId);
            if (product.owner !== ownerEmail) {
                throw new CustomError('You are not allowed to delete this product','INVALID_DATA');
            }
        }
        return await productDAO.deleteProduct(productId);
    }

    static async addProduct(product) {
        return await productDAO.addProduct(product);
    }

    static async updateProduct(productId, product, owneremail = null) {
        if (owneremail) {
            const product = await productDAO.getProductById(productId);
            if (product.owner !== owneremail) {
                throw new CustomError('You are not allowed to edit this product','INVALID_DATA');
            }
        }
        return await productDAO.updateProduct(productId, product); 
    }
}

export default ProductsService;
