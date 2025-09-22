import { signIn, signOut, signUp, updateProfile } from "@controllers/auth.controller";
import { protectRoute } from "@middlewares/auth.middleware";
import { Router } from "express";

const authRouter = Router();


authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.put("/update-profile", protectRoute, updateProfile);

export default authRouter;