import { Schema, Types, Document, model } from "mongoose";
import { IUser } from "./user";
import { IProductCategory } from "./productCategory";

export interface IProduct extends Document<Types.ObjectId> {
  name: string;
  description: string;
  category: IProductCategory;
  brand: string;
  price: number;
  discountPercent: number;
  image: string[];
  remaining: number;
  visible: boolean;
  readCount: number;
  createdBy: IUser;
  updatedBy: IUser;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Product_Category",
    required: true,
  },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  image: { type: [String], default: [] },
  remaining: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  readCount: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model<IProduct>("Product", ProductSchema);
