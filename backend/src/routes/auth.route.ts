import { checkAuthenticated, signIn, signOut, signUp, updateProfile } from "@controllers/auth.controller";
import { arcjetProtection } from "@middlewares/arcjet.middleware";
import { protectRoute } from "@middlewares/auth.middleware";
import { Router } from "express";

const authRouter = Router();


authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.put("/update-profile", protectRoute, updateProfile);
authRouter.get("/check", protectRoute, checkAuthenticated);

export default authRouter;