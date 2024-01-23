import { Router } from "express";
import { Register } from "../controler/user.contriler.js";

const router = Router();
router.route("/register").post(Register);
export default router;
