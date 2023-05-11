import { RequestHandler } from "express";
import ProductModel from "../models/product";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import ProductCategoryModel from "../models/productCategory";
import UserModel, { IUser } from "../models/user";

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
  createdBy?: string;
  updatedBy?: string;
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

    remaining,
    visible,
    // createdBy,
  } = req.body;

  const session = await mongoose.startSession();
  try {
    //Хүсэлтээс орж ирж буй мэдээллүүд бүрэн эсэхийг шалгана.
    if (!name) throw createHttpError(400, "Барааны нэр заавал шаардлагатай");
    if (!category)
      throw createHttpError(400, "Бүтээгдэхүүний ангилал заавал шаардлагатай");
    if (!price)
      throw createHttpError(400, "Бүтээгдэхүүний үнэ заавал шаардлагатай");
    // if (!image)
    //   throw createHttpError(400, "Бүтээгдэхүүний зураг заавал шаардлагатай");
    if (!remaining)
      throw createHttpError(400, "Бүтээгдэхүүний үлдэгдэл заавал шаардлагатай");
    // if (!createdBy)
    //   throw createHttpError(
    //     400,
    //     "Бүтээгдэхүүн оруулсан хэрэглэгч заавал шаардлагатай"
    //   );
    if (!mongoose.isValidObjectId(category))
      throw createHttpError(400, "Ангилалын id буруу байна.");
    // if (!mongoose.isValidObjectId(createdBy))
    //   throw createHttpError(400, "Хэрэглэгчийн id буруу байна.");

    //Category, CreatedBy(IUser) transaction хийнэ.
    session.startTransaction();

    //Хүсэлтээр орж ирсэн ангилал бүртгэлтэй эсэхийг шалгана. Байвал цааш үргэлжлүүлнэ.
    const isCategoryExist = await ProductCategoryModel.findById(
      category,
      null,
      { session }
    );
    if (!isCategoryExist)
      throw createHttpError(404, "Бүтээгдэхүүний ангилал олдсонгүй");

    //Хүсэлтээр орж ирсэн хэрэглэгчийн ID бүртгэлтэй эсэхийг шалгана. Байвал цааш үргэлжлүүлнэ.
    // const isUserExist = await UserModel.findById(createdBy, null, {
    //   session,
    // });
    // if (!isUserExist) throw createHttpError(404, "Хэрэглэгч олдсонгүй");

    const [newProduct] = await ProductModel.create(
      [
        {
          name,
          description,
          category,
          brand,
          price,
          discountPercent,

          remaining,
          visible,
          // createdBy,
        },
      ],
      { session }
    );

    // Шинээр бүтээгдэхүүн үүссэний дараа бүртгэлтэй ангилалын бүтээгдэхүүний тоог нэгээр нэмнэ.
    isCategoryExist.productCount += 1;
    await isCategoryExist.save({ session });

    //Шинээр бүтээгдэхүүн үүссэний дараа бүртгэлтэй хэрэглэгчийн бүтээгдэхүүний тоог нэгээр нэмнэ.
    // isUserExist.ownProducts.push(newProduct._id);
    // await isUserExist.save({ session });

    await session.commitTransaction();

    res
      .status(201)
      .json({ message: `${name} нэртэй бүтээгдэхүүн амжилттай нэмэгдлээ` });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }

  session.endSession();
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
    updatedBy,
  } = req.body;

  const session = await mongoose.startSession();

  try {
    //Хүсэлтээс орж ирж буй мэдээллүүд бүрэн эсэхийг шалгана.
    if (!mongoose.isValidObjectId(id))
      throw createHttpError(400, "Id буруу байна.");
    if (!name) throw createHttpError(400, "Барааны нэр заавал шаардлагатай");
    if (!category)
      throw createHttpError(400, "Бүтээгдэхүүний ангилал заавал шаардлагатай");
    if (!price)
      throw createHttpError(400, "Бүтээгдэхүүний үнэ заавал шаардлагатай");
    if (!image)
      throw createHttpError(400, "Бүтээгдэхүүний зураг заавал шаардлагатай");
    if (!remaining)
      throw createHttpError(400, "Бүтээгдэхүүний үлдэгдэл заавал шаардлагатай");
    if (!updatedBy)
      throw createHttpError(
        400,
        "Бүтээгдэхүүн оруулсан хэрэглэгч заавал шаардлагатай"
      );

    session.startTransaction();

    // Хүсэлтээс орж ирсэн ангилал байгаа эсэхийг шалгана. Байвал цааш үргэлжлүүлнэ.
    const isCategoryExist = await ProductCategoryModel.findById(
      category,
      null,
      { session }
    );
    if (!isCategoryExist)
      throw createHttpError(404, "Сонгосон ангилал олдсонгүй.");

    // Хүсэлтээс орж ирсэн id-тай бүтээгдэхүүн байгаа эсэхийг шалгана. Байвал цааш үргэлжлүүлнэ.
    const product = await ProductModel.findById(id, null, { session });
    if (!product) throw createHttpError(404, "Бүтээгдэхүүн олдсонгүй.");

    // Хүсэлтээр орж ирсэн ангилал, өмнө нь бүртгэлтэй байгаа ангилалтай адилхан байгаа эсэхийг шалгана.
    const isCategorySame = product.category?.toString() === category;

    // Хүсэлтээр орж ирсэн ангилал болон өмнө нь бүртгэлтэй байсан ангилал өөр байвал хуучин ангилалын тооноос нэгийг хасаад шинэ дээр нь нэгийг нэмнэ.

    if (!isCategorySame) {
      const oldCategory = await ProductCategoryModel.findById(
        product.category,
        null,
        { session }
      );
      if (oldCategory) {
        oldCategory.productCount -= 1;
        await oldCategory.save({ session });
      }
      isCategoryExist.productCount += 1;
      await isCategoryExist.save({ session });
    }
    // Хүсэлтээр орж ирсэн мэдээллийн дагуу бүтээгдэхүүний мэдээллийг шинэчлэнэ.
    await product.updateOne(
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
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({ message: "Амжилттай" });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }

  session.endSession();
};

//DELETE PRODUCT BY ID

export const deleteProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  try {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError(400, "ID буруу байна.");

    session.startTransaction();

    // Хүсэлтээр орж ирсэн id-тай бүтээгдэхүүн байгаа эсэхийг шалгана. Байвал цааш үргэлжлүүлнэ.
    const product = await ProductModel.findById(id, null, { session });
    if (!product) throw createHttpError(404, "Сургалт олдсонгүй.");

    // Бүтээгдэхүүн дээр бүртгэлтэй байгаа ангилалыг олоод сургалтын тооноос нэгийг хасна.
    const category = await ProductCategoryModel.findById(
      product.category,
      null,
      { session }
    );
    if (category) {
      category.productCount -= 1;
      await category.save({ session });
    }

    //Бүтээгдэхүүнээ устгах
    await product.deleteOne({ session });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
