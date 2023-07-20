import ProductManager from "./dao/managers/ProductManager.js";
import {productManager} from "./utils/contextClasses.js";

const pManager = new ProductManager('./src/data/products.json');

const load = async () => {
  const products = await pManager.getProducts();
  products.forEach( async (product) => {
    delete product.id;
    await productManager.addProduct(product);
    console.log(product.title);
  });
}

load();