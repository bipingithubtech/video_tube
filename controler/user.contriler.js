import { asyncHandler } from "../utils/async.js";
import { apiError } from "../utils/errorhandle.js";
import { User } from "../models/user.model.js";
import { Uploadcloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/responseapi.js";

const Register = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email:", email, "fullName:", fullName, "username", username);
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
  console.log(avatarLocalPath);

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
    username: username.toLowerCase(),
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

const generateAcessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessTokens = user.generateToken();
    const refreshTokens = user.generateFreshToken();

    user.refreshToken = refreshTokens;
    await user.save({ validateBeforeSave: false });
    return { accessTokens, refreshTokens };
  } catch {
    throw new apiError(500, "something went wrong while genetrating token");
  }
};
const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // check user exixt
  const alredylogdin = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (alredylogdin) {
    throw new apiError(400, "user is already loged in");
  }

  // password check
  const passwordCheck = await alredylogdin.isPasswordCorrect(password);

  if (!passwordCheck) {
    throw new apiError(401, "invalid password");
  }
  // tokens
  // Generate access and refresh tokens for the user

  const { accessTokens, refreshTokens } =
    await generateAcessTokenAndRefreshToken(existingUser._id);

  // Find the logged-in user by ID
  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  // send to cookies
  const option = {
    HttpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessTokens", accessTokens, option)
    .cookie("refreshTokens", refreshTokens, option)
    .json(
      new Apiresponse(
        {
          user: loggedInUser,
          accessTokens,
          refreshTokens,
        },
        "user sucessfuly logedin"
      )
    );
});

export { Register };
