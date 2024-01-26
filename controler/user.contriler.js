import { asyncHandler } from "../utils/async.js";
import { apiError } from "../utils/errorhandle.js";
import { User } from "../models/user.model.js";
import { Uploadcloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/responseapi.js";

const Register = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email:", email, "fullName:", fullName);
  //  vadidation check
  if (
    [fullName, email, username, password].some((feild) => feild?.trim() == "")
  ) {
    throw new apiError(400, "all feilds are required");
  }
  // check weather user is already exist or not
  const exituser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (exituser) {
    throw new apiError(400, "user is alrady exist");
  }

  const avatarLocalPath = req.files?.avtar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "avater files is required");
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const avtar = await Uploadcloudinary(avatarLocalPath);

  const coverImage = await Uploadcloudinary(coverImageLocalPath);

  if (!avtar) {
    throw new apiError(400, "avatar feild is reqired");
  }

  const user = await User.create({
    username: username?.toLowerCase(),
    email,
    fullName,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
    password,
  });
  const createdUser = await User.findById(user._id).select(
    // select those feild which are not reqired
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "semething went wrongwhile registering the user");
  }

  return res
    .status(201)
    .json(new Apiresponse(200, createdUser, "user registered sucessfully"));
});

export { Register };
