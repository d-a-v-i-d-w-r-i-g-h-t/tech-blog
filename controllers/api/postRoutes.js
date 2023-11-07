const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/authorize');

// POST route to create a post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT route to update a post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    if (!postData[0]) {
      res.status(404).json({ success: false, message: 'No post found with this id!' });
      return;
    }

    res.status(200).json({ success: true, message: 'Post updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE route to delete a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ success: false, message: 'No post found with this id!' });
      return;
    }

    res.status(200).json({ success: true, message: 'Post deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
