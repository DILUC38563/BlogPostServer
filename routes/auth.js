import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

//Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(404)
        .json({ message: "incorrect username or password" });
    }

    const matchedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!matchedPassword) {
      return res
        .status(400)
        .json({ message: "incorrect username or password" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
