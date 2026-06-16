import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // node fs file read package

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload files on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Not upload, Local File Path is empty");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // File has been uploaded succefull.
    // console.log(`File is uploaded on cloudinary `, response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove the locally save temp file as the upload operation got fail.
    return null;
}
};

export {uploadOnCloudinary}
