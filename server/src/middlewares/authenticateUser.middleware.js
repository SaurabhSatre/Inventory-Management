import jwt from "jsonwebtoken";
import _ from "lodash"; // Assuming you are using lodash

const protect = async (req, res, next) => {
    try{
        let token;

    // Check for token in Authorization header (Bearer token) or in cookies
    if (!_.isEmpty(req.headers.authorization) && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]; // Extract token from Bearer <token> format
    } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken; // Check for token in cookies if available
    }

    // If no token found, return an error response
    if (_.isEmpty(token)) {
        return res.status(401).json({
            success: false,
            message: "You are not logged in! Please login to get access.",
        });
    }

    // Decode and verify the token
    let decoded;

    // console.log(decoded);

    jwt.verify(token, process.env.JWtSecret, (err, result) => {
        if (err) {
            console.error('Error decoding token:', err.message);
        } else {
            decoded = result;
        }
    });

   // console.log("This is decode:", decoded);

    // Check if decoded token contains necessary user details
    if (!decoded || !decoded.userDetails || !decoded.userDetails.id || !decoded.userDetails.email) {
        return res.status(401).json({
            success: false,
            message: "The token is invalid!",
        });
    }

    // Optionally, you can fetch the user from the database if needed, or do further checks.
    // const user = await UserModel.findById(decoded.userDetails._id);
    // if (!user) {
    //     return res.status(401).json({
    //         success: false,
    //         message: "The user belonging to this token does no longer exist!",
    //     });
    // }

    // Attach user details to the request object for later use in route handlers
    req.user = decoded.userDetails;
    req.userDetails = decoded.userDetails; // User details from the token

    console.log("This is user details:", req.userDetails);

    // Proceed to the next middleware or route handler
    next();
    }
    catch(error){
        res.status(500).json({success : false, message: error.message });
    }
};

export default protect;