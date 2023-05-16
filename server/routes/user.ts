import express from "express";
import { getAllUsers } from "../controllers/user";

const userRouter = express.Router();

//Routes
userRouter.get("/", getAllUsers);

export default userRouter;
