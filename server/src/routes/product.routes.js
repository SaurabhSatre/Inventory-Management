import express from "express";
import authenticateUserMiddleware from "../middlewares/authenticateUser.middleware.js";
//import getUserInfoController from "../controllers/getUserInfo.controller.js";
import addProduct from "../controllers/addproduct.controller.js";
import deleteProduct from "../controllers/deleteproduct.controller.js";
import editProduct from "../controllers/editproduct.js";
import getAllProducts from "../controllers/getproducts.controller.js";

const router = express.Router();

router.post("/product/add" , addProduct);
router.post("/product/edit/:id" , editProduct);
router.post("/product/delete/:id" , deleteProduct);
router.get("/product" , getAllProducts);

// router.get("/user/info" , authenticateUserMiddleware , getUserInfoController);

export default router;