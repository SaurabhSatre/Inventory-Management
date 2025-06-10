import express from "express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import ApiError from "./utils/ApiError.js";
import globalErrorHandler from "./controllers/error.controllers.js";

const app = express();

// ========== Middleware ==========

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8000" ,  "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
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
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ========== Routes ==========
app.get("/" , (req ,res)=>{
  return res.send("Hello Server is Started");
}) 

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

export default app;