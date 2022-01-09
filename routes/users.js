import express from "express";
import bcrypt from "bcrypt";
import Post from "../models/Post.js";
import User from "../models/User.js";

const router = express.Router();

//Update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(401).json("Can't Update");
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("User has been deleted");
      } catch (error) {
        res.status(401).json(error);
      }
    } catch (error) {
      res.status(404).json("User not found");
    }
  } else {
    return res.status(401).json("Can't Delete");
  }
});

//Get
router.get("/:id", async (req, res) => {
  try {
    const user =await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
