import express from "express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import ApiError from "./utils/ApiError.js";
import globalErrorHandler from "./controllers/error.controllers.js";
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.routes.js"; // Adjusted path if file is inside src
import productRoutes from "./routes/product.routes.js";

dotenv.config({ path: "../.env" }); // Make sure path is correct relative to this file

const app = express();
const PORT = process.env.PORT || 8000;

// ========== Middleware ==========

// CORS Configuration
app.use(
  cors({
    origin: "*", // Allows requests from all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"], // Explicitly allow common methods, though '*' often implies all
    credentials: true, // Keep this if your frontend needs to send cookies/auth headers
  })
);

// Parsing Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Static Files
app.use(express.static("public"));

// Session Middleware
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ========== Routes ==========
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);

// ========== 404 Handler ==========
/*
app.all("*", (req, res, next) => {
  next(
    new ApiError(
      `Can't find ${req.originalUrl} on this server. Please check /api-docs for available routes.`,
      404
    )
  );
});
*/
// ========== Global Error Handler ==========
app.use(globalErrorHandler);

// ========== Start Server ==========
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
