import CartModel from '../models/CartModel.js';

class CartManager {
  async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity, productManager) {
    try {
      const cart = await CartModel.findById(cartId);

      const product = await productManager.getProductById(productId);

      const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  async updateProductInCart(cartId, productId, quantity) {
    try {
        const cart = await CartModel.findById(cartId);

        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
        } else {
            throw new Error('Product not found in cart.');
        }
    } catch (error) {
        throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
        const cart = await CartModel.findById(cartId);

        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId); 
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            await cart.save();
        } else {
            throw new Error('Product not found in cart.');
        }
    } catch (error) {
        throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate('products.productId').lean();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
        const cart = await CartModel.findById(cartId);
        cart.products = products
        await cart.save();
    } catch (error) {
        throw error;
    }
  }

  async deleteCart(cartId) {
    try {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found.');
        }

        cart.products = [];
        
        await cart.save();
    } catch (error) {
        throw error;
    }
  }
}

export default CartManager;
