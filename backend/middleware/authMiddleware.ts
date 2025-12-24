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

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "customer";
  };
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

      const user = await User.findById(decoded.user.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      };

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

export { protect, admin };
