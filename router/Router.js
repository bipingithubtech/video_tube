import { Router } from "express";
import { Register } from "../controler/user.contriler.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avtar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  Register
);
export default router;
