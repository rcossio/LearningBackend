import {productDAO} from "../data/factory.js";

class ProductsService {

    static async getProducts(filter, options) {
        return await productDAO.getProducts(filter, options);
    }

    static async getProductById(productId) {
        return await productDAO.getProductById(productId);
    }

    static async deleteProduct(productId) {
        return await productDAO.deleteProduct(productId);
    }

    static async addProduct(product) {
        return await productDAO.addProduct(product);
    }

    static async updateProduct(productId, product) {
        return await productDAO.updateProduct(productId, product); 
    }
}

export default ProductsService;
