import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDNIARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.API_SECRET,
});

const Uploadcloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    //    uplaod file on cloudinary
    const response = cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch {
    // when you call fs.unlinkSync(localFilePath),
    // the specified file at localFilePath will be deleted,
    // and the function call will block the execution of the program until the deletion is complete.
    // If the file is successfully deleted, the function will return undefined.

    fs.unlinkSync(localFilePath);
    return null;
  }
};
export { Uploadcloudinary };
