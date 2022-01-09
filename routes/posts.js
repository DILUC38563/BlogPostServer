import express from "express";
import Post from "../models/Post.js";


const router = express.Router();

//Create post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update Post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        return res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      return res.status(401).json("can't update");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete Post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        return res.status(200).json("Post has been deleted");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      return res.status(401).json("can't delete");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All Post

router.get("/", async (req, res) => {
    const username = req.query.user
    const category = req.query.category
    try {
      let posts
      if(username){
          posts =await Post.find({username})
      }
      else if(category){
          posts = await Post.find({categories:{
              $in:[category]
          }})
      }
      else{
          posts = await Post.find()
      }
      return res.status(200).json(posts)
    } catch (error) {
      res.status(500).json(error);
    }
  });

export default router;
