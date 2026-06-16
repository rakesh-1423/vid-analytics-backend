import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  // check user already exits ?
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
    throw ApiError(400, "avatar file is required");
  }
  //upload image on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // check avatar image upload on cloudinary or not
  if (!avatar) {
    throw ApiError(400, "avatar file is required.");
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
    throw ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully."));
});

export { registerUser };
