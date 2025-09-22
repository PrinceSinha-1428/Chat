import User from "@models/user.model";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { generateToken, returnError } from "@lib/utils";
import { sendWelcomeEmail } from "emails/emailHandlers";
import { ENV } from "@config/env";




export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
      return res.status(400).json({ sucess: false,  message: "All fields required" });
    }

    if(password.length < 6) return res.status(400).json({ sucess: false, message: "Password must be 6 character long"});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) return res.status(400).json({ sucess: false, message: "Invalid email format" });

    const alreadyExists = await User.findOne({ email });
    if(alreadyExists) return res.status(400).json({ sucess: false, message: "User already exists"});

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({ name, email, password: hashedPassword });  

    if(newUser){
      const savedUser = await newUser.save();
      generateToken(savedUser.id, res);
      try {
        await sendWelcomeEmail(savedUser.email,savedUser.name, ENV.CLIENT_URL)
      } catch (error) {
        console.log("failed to send welcome email")
      } finally {
        return res.status(201).json({ sucess: true, message: "user created succesfully", newUser });
      }
    } else {
      return res.status(400).json({ sucess: false, message: "Invalid User Data"});
    }
  } catch (error) {
    returnError(error, res);
  }
};


export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user  = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: "Invalid Credentialsr"});
    generateToken(user.id, res);
    return res.status(200).json({ 
      success: true,
      user,
    })
  } catch (error) {
    returnError(error,res);
  }
};

export const signOut = async (_req: Request,res: Response) => {
  res.cookie("jwt", "", { maxAge: 0});
  return res.status(200).json({ success: true, message: "Signed out successfully"})
}