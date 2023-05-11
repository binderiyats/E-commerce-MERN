import mongoose from "mongoose";
import UserModel from "../models/user";
import { RequestHandler } from "express";
import createHttpError from "http-errors";

interface UserBody {
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
  email?: string;
  address?: string;
  password?: string;
  ownProducts?: string;
}

interface UserParams {
  id: string;
}
//GET ALL USERS
export const getAllUser: RequestHandler = async (req, res, next) => {
  try {
    const users = await UserModel.find().populate("role");
    res.status(200).json({ message: "Амжилттай", body: users });
  } catch (error) {
    next(error);
  }
};

//GET AN USER BY ID
export const getOneUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Хүсэлтээр ирсэн id зөв эсэхийг шалгана.
    if (!mongoose.isValidObjectId(id))
      throw createHttpError(400, "ID буруу байна.");

    const user = await UserModel.findById(id).populate("role");
    // Хүсэлтээр орж ирсэн id-тай хэрэглэгч байгаа эсэхийг шалгана.
    if (!user) throw createHttpError(404, "Хэрэглэгч олдсонгүй");
    res.status(200).json({ message: "Амжилттай", body: user });
  } catch (error) {
    next(error);
  }
};

//DELETE AN USER BY ID
export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError(400, "ID буруу байна.");

    const user = await UserModel.findById(id);
    if (!user) throw createHttpError(404, "Хэрэглэгч олдсонгүй");

    await user.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

//UPDATE AN USER BY ID

export const updateUser: RequestHandler<
  UserParams,
  unknown,
  UserBody,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, role, phone, email, address } = req.body;
  try {
    if (!firstName)
      throw createHttpError(400, "Хэрэглэгчийн нэр заавал шаардлагатай.");
    if (!lastName)
      throw createHttpError(400, "Хэрэглэгчийн овог заавал шаардлагатай.");
    if (!role)
      throw createHttpError(400, "Хэрэглэгчийн Role заавал шаардлагатай.");
    if (!phone)
      throw createHttpError(400, "Хэрэглэгчийн утасны дугаар шаардлагатай.");
    if (!email)
      throw createHttpError(400, "Хэрэглэгчийн и-мэйл заавал шаардлагатай.");

    const isEmailExist = await UserModel.findOne({ email, _id: { $ne: id } });
    if (isEmailExist)
      throw createHttpError(
        400,
        `${email} хаягтай хэрэглэгч бүртгэлтэй байна.`
      );

    const isPhoneExist = await UserModel.findOne({ phone, _id: { $ne: id } });
    if (isPhoneExist)
      throw createHttpError(
        400,
        `${phone} утастай хэрэглэгч бүртгэлтэй байна.`
      );

    const updatedUser = await UserModel.findById(id);
    if (!updatedUser) throw createHttpError(404, "Хэрэглэгч олдсонгүй.");

    await updatedUser.updateOne({
      firstName,
      lastName,
      fullName: lastName + " " + firstName,
      email,
      phone,
      address,
      role,
    });
    res.status(200).json({ message: "Амжилттай шинэчлээ" });
  } catch (error) {
    next(error);
  }
};
