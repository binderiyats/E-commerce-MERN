import { RequestHandler } from "express";
import ProductCategoryModel from "../models/productCategory";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import slugify from "slugify";

//GET ALL PRODUCT CATEGORIES
export const getProductCategories: RequestHandler = async (req, res, next) => {
  try {
    const productCategories = await ProductCategoryModel.find();
    res.status(200).json({ message: "Амжилттай", body: productCategories });
  } catch (error) {
    next(error);
  }
};

//GET SINGLE PRODUCT CATEGORY BY ID
export const getSingleProductCategory: RequestHandler = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError(400, "ID буруу байна.");

    const productCategory = await ProductCategoryModel.findById(id);

    if (!productCategory) throw createHttpError(404, "Ангилал олдсонгүй.");
    res.status(200).json({ message: "Амжилттай", body: productCategory });
  } catch (error) {
    next(error);
  }
};

interface ProductCategoryBody {
  name?: string;
  slug?: string;
  description?: string;
}
//CREATE A PRODUCT CATEGORY
export const createProductCategory: RequestHandler<
  unknown,
  unknown,
  ProductCategoryBody,
  unknown
> = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    if (!name) throw createHttpError(400, "Ангилалын нэр заавал шаардлагатай.");
    //slug-ийг шалгана.
    const slug = slugify(name).toLowerCase();
    const isSlugExist = await ProductCategoryModel.findOne({ slug });
    if (isSlugExist)
      throw createHttpError(
        400,
        `${name} нэртэй ангилал өмнө нь бүртгэгдсэн байна. Өөр нэр сонгоно уу...`
      );

    const newProductCategory = await ProductCategoryModel.create({
      name,
      slug,
      description,
    });
    res.status(200).json({ message: "Амжилттай", body: newProductCategory });
  } catch (error) {
    next(error);
  }
};

//DELETE PRODUCT CATEGORY BY ID
export const deleteProductCategory: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    //Хүсэлтээр ирсэн ID mongoose-ийн valid object ID мөн эсэхийг шалгана. Буруу бол 400 буцаана.
    if (!mongoose.isValidObjectId(id))
      throw createHttpError(400, "ID буруу байна.");
    const productCategory = await ProductCategoryModel.findById(id);
    //Орж ирсэн ID-тай ангилал байгаа эсэхийг шалгана. Байхгүй бол 404 буцаан.
    if (!productCategory) throw createHttpError(404, "Ангилал олдсонгүй.");
    //Байсан тохиолдолд устгаад зөвхөн статус буцаана. Body буцаахгүй.
    await productCategory.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

interface ProductCategoryParams {
  id: string;
}
//UPDATE PRODUCT CATEGORY BY ID
export const updateProductCategory: RequestHandler<
  ProductCategoryParams,
  unknown,
  ProductCategoryBody,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError(400, "ID буруу байна.");

    if (!name) throw createHttpError(400, "Ангилалын нэр заавал шаардлагатай.");
    //slug-ийг шалгана.
    const slug = slugify(name).toLowerCase();
    const isSlugExist = await ProductCategoryModel.findOne({
      slug,
      _id: { $ne: id },
    });
    if (isSlugExist)
      throw createHttpError(
        400,
        `${name} нэртэй ангилал өмнө нь бүртгэгдсэн байна. Өөр нэр сонгоно уу...`
      );
    const productCategory = await ProductCategoryModel.findById(id);
    if (!productCategory) throw createHttpError(404, "Ангилал олдсонгүй.");

    productCategory.name = name;
    productCategory.slug = slug;
    productCategory.description = description;

    const editedProductCategory = await productCategory.save();
    res.status(200).json({
      message: `${name} нэртэй ангилалын мэдээлэл амжилттай шинэчлэгдлээ.`,
      body: editedProductCategory,
    });
  } catch (error) {
    next(error);
  }
};
