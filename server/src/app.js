import express from "express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import ApiError from "./utils/ApiError.js";
import globalErrorHandler from "./controllers/error.controllers.js";
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.routes.js"; 
import productRoutes from "./routes/product.routes.js";

dotenv.config({ path: "../.env" }); 

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"], 
    credentials: true, 
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(express.static("public"));

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);


app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

startServer();
