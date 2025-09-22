import { Response } from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { ENV } from "@config/env";

export const generateToken = (id: mongoose.ObjectId, res: Response) => {

  const { JWT_SECRET, NODE_ENV } = ENV;
  if(!JWT_SECRET) throw new Error("JWT is not configured");
  
  const token = jwt.sign({id}, JWT_SECRET, { expiresIn: '7d'});

  if(!NODE_ENV) throw new Error("JWT is not configured");

  res.cookie("jwt",token,{
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: NODE_ENV === 'production' ? true : false
  });
}

export const returnError = (error: unknown, res: Response) => {
  if(error instanceof Error){
    return res.status(500).json({ sucess: false, message: error.message });
  }
}