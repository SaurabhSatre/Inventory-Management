import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

/* Bcrypt turns a simple password into fixed-length characters called a hash. Before hashing a password,
 bcrypt applies a salt — a unique random string that makes the hash unpredictable */
import bcrypt from "bcryptjs";
import { validateEmail, validatePassword } from "../utils/helper.functions.js";

const loginUserController =
    async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, status: 400, message: "Please provide required data!!" });
        }

        if(!validateEmail(email)){
            return res.json({ success: false, status: 400, message: "Please provide valid email!!" });
        }

        if(!validatePassword(password)){
            return res.json({ success: false, status: 400, message: "Please provide valid password!!" });
        }

        // console.log(req.body);

        try {
            let userData = await UserModel.findOne({ email });

            if (!userData) {
                return res.json({ success: false, status: 400, message: "Please!! Enter Correct Email" });
            }

            // This is used to compare password hash with simple password returns true if same else false 
            const pwdCompare = await bcrypt.compare(req.body.password, userData.password);

            if (!(pwdCompare)) {
                return res.json({ success: false, status: 400, message: "Please!! Enter Correct Password" });
            }

            // Auth Token using json web token (jwt) --> created and passed to frontend 

            const data = {
                userDetails: {
                    "id": userData._id,
                    "name" : userData.name,
                    "email" : email
                }
            }

            // It generates a JWT token by signing the data with a secret key.
            const authToken = jwt.sign(data, process.env.JWtSecret);

            return res.status(200).json({ success: true, authToken: authToken , message : "User loggined successfully!!"});
        }
        catch (error) {
            res.json({ success: false, status: 400, message: error.message });
        }
    };

export default loginUserController;