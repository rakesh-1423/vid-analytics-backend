import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

// not use res field so at place you can give _
export const verifyJWT = asyncHandler( async (req, _, next) => {  
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select(
            "-password"
        )
    
        if(!user){
            //Todo: discussion about frontend
            throw new ApiError(401, "Invalid access token")
        }
    
        req.user = user;
        next()   // middleware ka kaam ho gya ab next logoutUser pe chale jao
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token.")
    } 
})