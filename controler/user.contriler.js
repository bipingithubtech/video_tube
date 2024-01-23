import { asyncHandler } from "../utils/async.js";

const Register = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "all okay",
  });
});

export { Register };
