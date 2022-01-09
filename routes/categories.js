import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const savedCate = await newCategory.save();
    return res.status(200).json(savedCate);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const cate = await Category.find();
    return res.status(200).json(cate);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
