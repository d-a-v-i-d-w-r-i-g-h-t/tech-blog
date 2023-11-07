const router = require('express').Router();
const { User, Post, Comment } = require('../models');

// route to get all posts
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: { exclude: ['id', 'content', 'date_created', 'user_id'] },
      order: [['date_created', 'DESC']],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.status(200).render('homepage', { posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// route to get all posts from one username
router.get('/posts/:username', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.params.username },
      attributes: ['id', 'username'],
    });

    if (!userData) {
      res.status(404).json({ success: false, message: 'No user found with this username!' });
      return;
    }

    const postData = await Post.findAll({
      where: { user_id: userData.id },
      attributes: { exclude: ['user_id'] },
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'author',
        },
        {
          model: Comment,
          attributes: ['text'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.status(200).render('posts', { posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// route to get one post by ID
router.get('/post/:id', async (req, res) => {
  try{ 
      const postData = await Post.findByPk(req.params.id, {
        attributes: { exclude: ['id', 'user_id'] },
        include: [ 
          { 
            model: User,
            attributes: ['username'],
            as: 'author'
          },
          { 
            model: Comment,
            attributes: ['text'],
            include: [
              {
                model: User,
                attributes: ['username'] 
              }
            ]
          }
        ],
      });

      if(!postData) {
          res.status(404).json({ success: false, message: 'No post with this id!' });
          return;
      }

      const post = postData.get({ plain: true });

      res.status(200).render('post', { post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    };     
});

// route to get all comments from one username
router.get('/comments/:username', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.params.username },
      attributes: ['id', 'username'],
    });

    if (!userData) {
      res.status(404).json({ success: false, message: 'No user found with this username!' });
      return;
    }

    const commentsData = await Comment.findAll({
      where: { user_id: userData.id },
      attributes: { exclude: ['id', 'user_id', 'post_id'] },
      include: [
        { model: User, attributes: ['username'] },
        {
          model: Post,
          attributes: ['id', 'title'],
          include: [
            {
              model: User,
              attributes: ['username'],
              as: 'author',
            },
          ],
        },
      ],
    });

    const comments = commentsData.map((comment) => comment.get({ plain: true }));

    res.status(200).render('comments', { comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// route to get one comment by ID
router.get('/comment/:id', async (req, res) => {
  try{ 
      const commentData = await Comment.findByPk(req.params.id, {
        attributes: { exclude: ['id', 'user_id', 'post_id'] },
        include: [ 
          { model: User, attributes: ['username'] },
          { 
            model: Post,
            attributes: ['title', 'content'],
            include: [
              {
                model: User,
                attributes: ['username'],
                as: 'author'
              }
            ]
          },
        ],
      });

      if(!commentData) {
          res.status(404).json({message: 'No comment with this id!'});
          return;
      }

      const comment = commentData.get({ plain: true });

      res.status(200).render('comment', comment);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    };     
});

module.exports = router;
