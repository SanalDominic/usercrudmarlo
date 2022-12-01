import User from "../models/User.js";
import { createError } from "../utils/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signin = async (req, res, next) => {
  try {
  
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Invalid Credentials"));

    //creating access token
    const token = jwt.sign({ id: user._id }, process.env.JWT);

    const { password, ...userDetails } = user._doc;

    //setting to cookie
    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ userDetails });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
  
    const user = await User.findOne({ email: req.body.email });

    if (user) return next(createError(403, "User Exist "));

    //hashing password
    const hash = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    return res.status(200).send("User has been created");

  } catch (error) {
    next(error);
  }
};
