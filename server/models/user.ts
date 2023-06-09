import { Schema, Document, Types, model } from "mongoose";

import { IUserRole } from "./userRole";
import { IProduct } from "./product";

interface UserAddress {
  country: string;
  city: string;
  district: string;
  apartment: string;
}

export interface IUser extends Document<Types.ObjectId> {
  firstName: string;
  lastName: string;
  fullName: string;
  role: IUserRole;
  phone: string;
  email: string;
  address?: UserAddress;
  ownProducts: IProduct["_id"][];
  password: string;
  order: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: {
      type: String,
      default: function () {
        return this.lastName + " " + this.firstName;
      },
    },
    role: { type: Schema.Types.ObjectId, ref: "User_Role" },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: {
      country: String,
      city: String,
      district: String,
      apartment: String,
      default: {},
    },
    ownProducts: { type: [Schema.Types.ObjectId], ref: "Product" },
    password: { type: String, required: true, select: false },
    order: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
