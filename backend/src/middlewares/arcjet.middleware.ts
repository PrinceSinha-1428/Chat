import { isSpoofedBot } from "@arcjet/inspect";
import aj from "@config/arcjet";
import { returnError } from "@lib/utils";
import { NextFunction, Request, Response } from "express";

export const arcjetProtection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req);
    if(decision.isDenied()){
      if(decision.reason.isRateLimit()) return res.status(429).json({ message: "Rate Limit Exceeded, Too Many Requests"});
      if(decision.reason.isBot()) return res.status(403).json({ message: "Bot detected"});
      return res.status(403).json({ message: "Access denied due to security policy"});
    }
    if(decision.results.some(isSpoofedBot)) return res.status(403).json({ error: "Spoofed bot detected", message: "Malicious Bot detected"});
    next();
  } catch (error) {
    returnError(error,res);
  }
}