import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"})) // receive json formate data limit 16kb
app.use(express.urlencoded({limit: "16kb"})) // url ko encode karne ke liye
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js';

// routes declear
app.use("/api/v1/users", userRouter)
// http://localhost:8000/api/v1/users/register

app.get("/res", (req, res)=>{
    res.send("Hello port i am from app 8k port")
})

export {app}
// or 
// export default app; 