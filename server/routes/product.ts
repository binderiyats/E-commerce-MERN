import express from "express";
import {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product";

const productRouter = express.Router();

// Routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getOneProduct);
productRouter.post("/", createProduct);
productRouter.patch("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);
export default productRouter;
