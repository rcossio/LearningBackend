import { Router } from "express";
import { productManager } from "../utils/contextClasses.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home',{products});
}); 

router.get("/chat", async (req, res) => {
  res.render('chat');
}); 

export {router};