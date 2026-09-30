const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

const router = express.Router();

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({
            message: "Invalid token"
        });
    }
}

// CREATE POST
router.post("/", authenticate, async (req, res) => {
    try {
        const { content, topic } = req.body;

        if (!content || !topic) {
            return res.status(400).json({
                message: "Content and topic are required"
            });
        }

        if (content.length > 280) {
            return res.status(400).json({
                message: "Post cannot exceed 280 characters"
            });
        }

        const post = await Post.create({
            content,
            topic,
            author: req.user.id
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
});

// GET POSTS
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch posts"
        });
    }
});

router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Failed to like post"
    });
  }
});

router.post("/:id/bookmark", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { bookmarks: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Failed to bookmark post"
    });
  }
});

// EDIT POST
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { content, topic } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own posts"
      });
    }

    post.content = content;
    post.topic = topic;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name");

    res.json(updatedPost);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to edit post"
    });
  }
});


// DELETE POST
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own posts"
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete post"
    });
  }
});

module.exports = router;