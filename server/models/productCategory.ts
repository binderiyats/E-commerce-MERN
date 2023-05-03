import { Schema, Types, Document, model } from "mongoose";

export interface IProductCategory extends Document<Types.ObjectId> {
  name: string;
  slug: string;
  description?: string;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IProductCategory>(
  "Product_Category",
  ProductCategorySchema
);
