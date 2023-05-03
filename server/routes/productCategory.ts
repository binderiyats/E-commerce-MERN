import express from "express";
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategories,
  getSingleProductCategory,
  updateProductCategory,
} from "../controllers/productCategory";

const productCategoryRouter = express.Router();

//Routes

//GET ALL
productCategoryRouter.get("/", getProductCategories);

//GET ONE BY ID
productCategoryRouter.get("/:id", getSingleProductCategory);

//POST
productCategoryRouter.post("/", createProductCategory);

//DELETE BY ID
productCategoryRouter.delete("/:id", deleteProductCategory);

//PATCH BY ID
productCategoryRouter.patch("/:id", updateProductCategory);

export default productCategoryRouter;
