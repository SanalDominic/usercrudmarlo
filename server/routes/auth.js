import express from "express";
import { signin, signup } from "../controllers/auth.js";

const router = express.Router();

//user signin
router.post("/signin", signin);

//user signup
router.post("/signup", signup);

export default router;
