import express from "express"
import Post from "../models/Post.js"
import Comment from "../models/Comment.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name avatar").sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    console.error("Get posts error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Search posts
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: "Search query is required" })
    }

    const posts = await Post.find({
      $or: [{ title: { $regex: q, $options: "i" } }, { content: { $regex: q, $options: "i" } }],
    })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    console.error("Search posts error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a specific post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name avatar")

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json(post)
  } catch (error) {
    console.error("Get post error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new post
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body

    const post = new Post({
      title,
      content,
      author: req.user._id,
    })

    await post.save()

    // Populate author info before sending response
    await post.populate("author", "name avatar")

    res.status(201).json(post)
  } catch (error) {
    console.error("Create post error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate("author", "name avatar")
      .sort({ createdAt: 1 })

    res.json(comments)
  } catch (error) {
    console.error("Get comments error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a comment to a post
router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body

    // Check if post exists
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const comment = new Comment({
      postId: req.params.id,
      content,
      author: req.user._id,
    })

    await comment.save()

    // Increment comment count
    post.commentCount += 1
    await post.save()

    // Populate author info before sending response
    await comment.populate("author", "name avatar")

    res.status(201).json(comment)
  } catch (error) {
    console.error("Create comment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

