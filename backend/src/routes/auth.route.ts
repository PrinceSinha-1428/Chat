import { signUp } from "@controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();


authRouter.post("/signup", signUp);
// authRouter.post("/signin", signUp);
authRouter.post("/signout",() => {});

export default authRouter;