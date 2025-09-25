import { ENV } from "@config/env";
import { returnError } from "@lib/utils";
import User from "@models/user.model";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export const protectRoute = async (req: Request, res: Response, next: NextFunction ) => {
  try {

    const token = req.cookies.jwt;
    if(!token) return res.status(401).json({ message: "Unauthorized: No Token Provided" });
    
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    if(!decoded) return res.status(401).json({ message: "Unauthorized: Invalid Token" });

    const  userId  = decoded.id ;
    const user = await User.findById(userId);
    if(!user) return res.status(400).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    returnError(error,res);
  }
}