import cloudinary from "@config/cloudinary";
import { returnError } from "@lib/utils";
import Message from "@models/message.model";
import User from "@models/user.model";
import { Request, Response } from "express";

export const getAllContacts = async (req: Request, res: Response) => {
  try {
   const loggedInUserId = req.user?._id;
   const filteredUsers = await User.find({ _id: { $ne: loggedInUserId }}).select("-password");
   return res.status(200).json({success: true, filteredUsers });
  } catch (error) {
    returnError(error,res);
  }
}
export const getChatPartners = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?._id;
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId},
        { receiverId: loggedInUserId},
      ]
    });
    const chatPartnersIds = [...new Set(messages.map((msg) => msg.senderId.toString() === loggedInUserId?.toString() ? msg.receiverId.toString() : msg.senderId.toString()))]
    const chatPartners = await User.find({ _id: { $in: chatPartnersIds }}).select("-password");
    return res.status(200).json({ succes: true, chatPartners})
  } catch (error) {
    returnError(error,res);
  }
}
export const getMessageByUserId = async (req: Request, res: Response) => {
  try {
    const myId = req.user?._id;
    const {id: userToChatId} = req.params;
    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId: userToChatId },
        {senderId: userToChatId, receiverId: myId },
      ]
    });
    return res.status(200).json({ succes: true, messages });
  } catch (error) {
    returnError(error,res);
  }
}
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;
    let imageUrl;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    };
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })
    await newMessage.save();
    return res.status(201).json({ succes: true, newMessage})
  } catch (error) {
    returnError(error,res);
  }
}