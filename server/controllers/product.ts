import { RequestHandler } from "express";
import ProductModel from "../models/product";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { log } from "console";

//GET ALL PRODUCTS
export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json({ message: "Амжилттай", body: products });
  } catch (error) {
    next(error);
  }
};

//GET SINGLE PRODUCT BY ID
export const getOneProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError(400, "ID буруу байна.");
    const product = await ProductModel.findById(id);

    if (!product) throw createHttpError(400, "Бараа олдсонгүй.");
    res.status(200).json({ message: "Амжилттай", body: product });
  } catch (error) {
    next(error);
  }
};

interface ProductBody {
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  price?: number;
  discountPercent?: number;
  image?: string[];
  remaining?: number;
  visible?: boolean;
  readCount: number;
  createdBy: string;
  updatedBy: string;
}

// CREATE NEW PRODUCT
export const createProduct: RequestHandler<
  unknown,
  unknown,
  ProductBody,
  unknown
> = async (req, res, next) => {
  const {
    name,
    description,
    category,
    brand,
    price,
    discountPercent,
    image,
    remaining,
    visible,
  } = req.body;

  const session = await mongoose.startSession();
  try {
    //Хүсэлтээс орж ирж буй мэдээллүүд бүрэн эсэхийг шалгана.
    if (!name) throw createHttpError(400, "Барааны нэр заавал шаардлагатай");
    if (!category)
      throw createHttpError(400, "Барааны төрөл заавал шаардлагатай");
    if (!price) throw createHttpError(400, "Барааны үнэ заавал шаардлагатай");
    if (!image) throw createHttpError(400, "Барааны зураг заавал шаардлагатай");

    //category holboh

    const newProduct = await ProductModel.create(
      [
        {
          name,
          description,
          category,
          brand,
          price,
          discountPercent,
          image,
          remaining,
          visible,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res
      .status(201)
      .json({ message: `${name} нэртэй бараа амжилттай нэмэгдлээ` });
  } catch (error) {
    await session.abortTransaction;
    next(error);
  }
};

//UPDATE PRODUCT BY ID
interface ProductParams {
  id: string;
}
export const updateProduct: RequestHandler<
  ProductParams,
  unknown,
  ProductBody,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    brand,
    price,
    discountPercent,
    image,
    remaining,
    visible,
  } = req.body;

  try {
    console.log();
  } catch (error) {
    next(error);
  }
};
