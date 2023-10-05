import {productDAO} from "../data/factory.js";

class ProductsService {

    static async getProducts(filter, options) {
        const result = await productDAO.getProducts(filter, options);
        if (!result || result.docs?.length === 0) {
            throw new Error('No products found.');
        }
        return result;
    }

    static async getProductById(productId) {
        const product = await productDAO.getProductById(productId);
        if (!product) {
            throw new Error('Product not found.');
        }
        return product;
    }

    static async deleteProduct(productId) {
        const result = await productDAO.deleteProduct(productId);
        if (!result) {
            throw new Error('Product not found. Unable to delete.');
        }
        return result;
    }

    static async addProduct(product) {
        return await productDAO.addProduct(product);
    }

    static async updateProduct(productId, product) {
        const updatedProduct = await productDAO.updateProduct(productId, product);
        if (!updatedProduct) {
            throw new Error('Product not found. Unable to update.');
        }
        return updatedProduct;
    }
}

export default ProductsService;
