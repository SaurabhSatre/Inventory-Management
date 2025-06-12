import jwt from "jsonwebtoken";
import _ from "lodash"; 

const protect = async (req, res, next) => {
    try{
        let token;

    if (!_.isEmpty(req.headers.authorization) && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]; 
    } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken; 
    }

    if (_.isEmpty(token)) {
        return res.status(401).json({
            success: false,
            message: "You are not logged in! Please login to get access.",
        });
    }

    let decoded;


    jwt.verify(token, process.env.JWtSecret, (err, result) => {
        if (err) {
            console.error('Error decoding token:', err.message);
        } else {
            decoded = result;
        }
    });

    if (!decoded || !decoded.userDetails || !decoded.userDetails.id || !decoded.userDetails.email) {
        return res.status(401).json({
            success: false,
            message: "The token is invalid!",
        });
    }

    req.user = decoded.userDetails;
    req.userDetails = decoded.userDetails; // User details from the token

    // console.log("This is user details:", req.userDetails);

    next();
    }
    catch(error){
        res.status(500).json({success : false, message: error.message });
    }
};

export default protect;