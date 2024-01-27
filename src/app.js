import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { upload } from "../middleware/multer.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// app.use(upload.any());

// import router
import UseRouter from "../router/Router.js";

app.use("/api/v1/users", UseRouter);

export { app };
