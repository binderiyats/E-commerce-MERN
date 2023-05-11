import express from "express";
import { signUp } from "../controllers/auth";

const authRoutes = express.Router();

//Routes
authRoutes.post("/signup", signUp);

export default authRoutes;
