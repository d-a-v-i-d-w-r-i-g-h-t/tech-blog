const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/authorize');

// POST route to create a comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT route to update a comment
router.put('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.update(
      {
        text: req.body.text,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    if (!commentData[0]) {
      res.status(404).json({ success: false, message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json({ success: true, message: 'Comment updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE route to delete a comment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!commentData) {
      res.status(404).json({ success: false, message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json({ success: true, message: 'Comment deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
