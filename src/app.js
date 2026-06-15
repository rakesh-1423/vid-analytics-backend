import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential:true
}))

app.use(express.json({limit: "16kb"})) // receive json formate data limit 16kb
app.use(express.urlencoded({limit: "16kb"})) // url ko encode karne ke liye
app.use(express.static("public"))
app.use(cookieParser())

export {app}
// or 
// export default app; 