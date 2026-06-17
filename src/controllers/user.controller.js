import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user =  await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;  // Refresh token store karte hai apne pass.
        await user.save({validateBeforeSave: false}) // refresh token save in db (validateBeforeSave: false) because not varify simply save

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token.")
    }
}

const registerUser = asyncHandler(async (req, res) => {
  // Algorithms for controller
  // get user details from frontend
  // validate - not empty
  // check if user already exit - username, email
  // check for image check for avatar
  // upload them to cloudinary avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { fullName, username, email, password } = req.body;
  console.log("Username receive : ", username);

  // check empty status
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }

  // check user already exits ? if exist then return its all data
  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser) {
    throw new ApiError(409, "user with this email and username already exist");
  }

  // check image
  const avatarLocalPath = req.files?.avatar[0].path;
  // const coverImageLocalPath = req.files?.coverImage[0].path;

  // check if coverImage not given by frontend
  let coverImageLocalPath = "";
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // avatar required so check
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }
  //upload image on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // check avatar image upload on cloudinary or not
  if (!avatar) {
    throw new ApiError(400, "avatar file is required.");
  }

  // Now upload on db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // check coverImage available then url otherwise ""
    email,
    password,
    username: username.toLowerCase(),
  });
  // check data upload successfully then have user._id
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // remove these two field so (-) sign use
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user 
    // password check 
    // access and refresh token 
    // send cookie (inside response)

    const {username, email, password} = req.body

    if(!(username || email)){
        throw new ApiError(400, "username or password is required")
    }

    const user = await User.findOne({
    $or: [{ username }, { email }]
    });

    if(!user){
        throw new ApiError(404, "User does not exist.")
    }

    const existringuser = await User.findById(user._id)

    // console.log("User new pass: ", password);
    // console.log("User existing pass : ", existringuser.password);
    // console.log("User existing username: ", existringuser.username);
    // console.log("User existing all data which return : ", existringuser);
    const isPasswordValid  = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credential")
    }

    // Access and Refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    // only modify server side not modify cookies from frontend side
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In successfully."
        )
    )
})

const logoutUser = asyncHandler( async (req, res) => {
    // Algorithms
    // find user identity (using middleware)
    // save refresh token empty

    await User.findByIdAndUpdate(
      req.user._id,   // find by user in db by id
      {
        $set: {   // $ set is function of mongodb
          refreshToken: undefined // update refreshToken, 
        }
      },
      {
        new: true   // isse db me updated user ka data return hoga
      }
    )

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))

})

export { registerUser, loginUser, logoutUser};
