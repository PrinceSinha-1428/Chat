import { Response } from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { ENV } from "@config/env";

export const generateToken = (id: mongoose.ObjectId, res: Response) => {
  const token = jwt.sign({id}, ENV.JWT_SECRET, { expiresIn: '7d'});
  res.cookie("jwt",token,{
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: ENV.NODE_ENV === 'production' ? true : false
  });
}

export const returnError = (error: unknown, res: Response) => {
  if(error instanceof Error){
    return res.status(500).json({ message: error.message });
  }
}