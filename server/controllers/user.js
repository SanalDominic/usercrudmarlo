import User from "../models/User.js";
import { createError } from "../utils/error.js";
import bcrypt from 'bcrypt'

export const profile = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findOne({ id });
    if (!user) return next(createError(404, "User not found"));

    const { password, ...userDetails } = user._doc;

    return res.status(200).json({ userDetails });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found"));
    if (req.user.id == user._id) {
      
      const hash = await bcrypt.hash(req.body.password, 10);
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ...req.body, password: hash },
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } else {
      return next(createError(403, "You can update only your account"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found"));

    if (req.user.id == user._id) {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("The user has been deleted");
    } else {
      return next(createError(403, "You can delete only your account"));
    }
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    return res.clearCookie("access_token").status(200).json("logged out");
  } catch (error) {
    next(error);
  }
};
