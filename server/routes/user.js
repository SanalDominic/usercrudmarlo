import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { deleteUser, editUser, profile, logout } from "../controllers/user.js";

const router = express.Router();



//profile page
router.get("/:id", verifyToken, profile);

//edit user details
router.put("/:id", verifyToken, editUser);

//user can delete the account
router.delete("/:id", verifyToken, deleteUser);

//logout user
router.post('/',verifyToken,logout) 

export default router;
