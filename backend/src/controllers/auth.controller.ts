import User from "@models/user.model";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { generateToken, returnError } from "@lib/utils";




export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
      return res.status(400).json({ message: "All fields required" });
    }

    if(password.length < 6) return res.status(400).json({ message: "Password must be 6 character long"});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });

    const alreadyExists = await User.findOne({ email });
    if(alreadyExists) return res.status(400).json({ message: "User already exists"});

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({ name, email, password: hashedPassword });  

    if(newUser){
      const savedUser = await newUser.save();
      generateToken(savedUser.id, res);
      return res.status(201).json({ message: "user created succesfully", newUser });
    } else {
      return res.status(400).json({ message: "Invalid User Data"});
    }
  } catch (error) {
    returnError(error, res);
  }
}