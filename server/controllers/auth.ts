import { RequestHandler } from "express";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

interface SignUpBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  rePassword?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
  remember?: boolean;
}

//CREATE AN USER
export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    password: rawPassword,
    rePassword,
  } = req.body;
  try {
    if (!firstName)
      throw createHttpError(400, "Хэрэглэгчийн нэр заавал шаардлагатай.");
    if (!lastName)
      throw createHttpError(400, "Хэрэглэгчийн оврг заавал шаардлагатай.");
    if (!email)
      throw createHttpError(400, "Хэрэглэгчийн и-мэйл заавал шаардлагатай.");
    if (!phone)
      throw createHttpError(400, "Хэрэглэгчийн утас заавал шаардлагатай.");
    if (!rawPassword)
      throw createHttpError(400, "Хэрэглэгчийн нууц үг заавал шаардлагатай.");
    if (rawPassword !== rePassword)
      throw createHttpError(400, "Нууц үг таарахгүй байна.");

    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist)
      throw createHttpError(
        400,
        `${email} хаягтай хэрэглэгч бүртгэлтэй байна.`
      );

    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Амжилттай бүртгэгдлээ" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
