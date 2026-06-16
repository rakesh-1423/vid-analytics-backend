import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) =>{
    res.status(200).json({
        message: "Rakesh 200 port succed"
    })
})

export {registerUser}