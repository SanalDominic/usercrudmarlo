import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

mongoose
  .connect(process.env.DB)
  .then(() => console.log("Db connected successfully"))
  .catch((error) => console.log(error));

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
       origin: process.env.ORIGIN,
       credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Connected to ${port}`));
