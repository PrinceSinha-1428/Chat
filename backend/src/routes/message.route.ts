import { Router } from "express";

const messageRouter = Router();


messageRouter.post("/send",() => {});
messageRouter.get("/recieve",(req,res) => { res.json({ message: "message"})});

export default messageRouter;