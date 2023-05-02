import { Schema, Document, Types, model } from "mongoose";

export interface IUserRole extends Document<Types.ObjectId> {
  role: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserRoleSchema = new Schema<IUserRole>(
  {
    role: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default model<IUserRole>("User_Role", UserRoleSchema);
