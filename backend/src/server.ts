import connectDB from '@config/db';
import { ENV } from '@config/env';
import authRouter from '@routes/auth.route';
import messageRouter from '@routes/message.route';
import express from 'express';
import path from 'path';


const app = express();
const PORT = ENV.PORT || 3000;


connectDB();




app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if(ENV.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  app.use((req,res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
})