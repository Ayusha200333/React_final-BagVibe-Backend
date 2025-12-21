// const jwt = require("jsonwebtoken")
// const User = require("../models/User")

// const protect = async (req , resizeBy , next) => {
//     let token

//     if(
//         req.headers.authorization && 
//         req.headers.authorization.startsWith("Bearer")
//     ){
//         try{
//             token=req.headers.authorization.split("")[1]
//             const decoded = jwt.verify(token,process.env.JWT_SECRET)

//             req.user = await User.findById(decoded.user.id).select("-password")
//             next()
//         }catch(error){
//             console.error("Token verification failed:",error)
//             resizeBy.status(401).json({message:"Not authorized,token failed"})
//         }
//     } else{
//         res.status(401).json({message:"Not authorized,no token provided"})
//     }
// }

// module.exports = {protect}



import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;

      req.user = await User.findById(decoded.user.id).select("-password");
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token provided",
    });
  }
};

export default protect;
