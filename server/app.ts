import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import env from "./configs/validateEnv";
import MongoStore from "connect-mongo";
import { MulterError } from "multer";
import createHttpError, { isHttpError } from "http-errors";

import productCategoryRoutes from "./routes/productCategory";
import productRoutes from "./routes/product";
import authRoutes from "./routes/auth";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

//Routes

app.use("/api/auth", authRoutes);
app.use("/api/products/categories", productCategoryRoutes);
app.use("/api/products", productRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Хүсэлт явуулсан хаяг олдсонгүй."));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "Тодорхойгүй алдаа гарлаа. Та дахин оролдоно уу.";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  if (error instanceof MulterError) {
    statusCode = 400;
    if (error.code === "LIMIT_UNEXPECTED_FILE")
      errorMessage = "Буруу өргөтгөлтэй файл байна.";
    if (error.code === "LIMIT_FILE_SIZE")
      errorMessage =
        "Файлын хэмжээ хэтэрсэн байна. 1GB-аас доош хэмжээтэй файл оруулна уу.";
  }

  res.status(statusCode).json({ error: errorMessage });
});
export default app;
