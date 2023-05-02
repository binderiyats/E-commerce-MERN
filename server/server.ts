import app from "./app";
import env from "./configs/validateEnv";
import mongoose from "mongoose";

const PORT = env.PORT;
const MONGO_URL = env.MONGO_CONNECTION_STRING;

mongoose.connect(MONGO_URL).then(() => {
  console.log("MongoDB is connected");
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
