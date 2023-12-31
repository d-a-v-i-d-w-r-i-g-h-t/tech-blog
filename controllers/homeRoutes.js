const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/authorize');
const sequelize = require('../config/connection');


    /////////////////////
   //  GET ALL POSTS  //
  /////////////////////
 //
// sorted by date (newest at the top)
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { published: true },
      attributes: { exclude: ['user_id', 'date_created'] },
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'author',
        },
        {
          model: Comment,
          attributes: ['id', 'text', 'date_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
              as: 'author',
            },
          ],
        },
      ],
      order: [
        ['date_published', 'DESC'], // sort posts by date_published, newest first
        [Comment, 'date_created', 'DESC'], // sort comments by date_created, newest first
      ], 
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    // console.dir(posts);

    const loggedIn = req.session.logged_in;
    const homepage = true;
    const userId = loggedIn ? req.session.user_id : '';
    // res.status(200).json(posts);
    res.status(200).render('homepage', { posts, loggedIn, userId, homepage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


    ////////////////////////////////////////////////
   //  GET ALL POSTS BY CURRENT USER: DASHBOARD  //
  ////////////////////////////////////////////////
 //
// sorted by date (newest at the top, unpublished first)
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      attributes: { exclude: ['user_id'] },
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'author',
        },
        {
          model: Comment,
          attributes: ['id', 'text', 'date_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
              as: 'author',
            },
          ],
        },
      ],
      order: [
        // ['published', 'ASC'], // Sort posts by 'published' in ascending order (false first), so unpublished posts come first
        ['date_created', 'DESC'], // Sort posts by 'published' in ascending order (false first), so unpublished posts come first
        ['date_published', 'DESC'], // Sort posts by 'date_published' in descending order for published posts
        [Comment, 'date_created', 'DESC'], // sort comments by date_created, newest first
      ], 
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    // console.dir(posts);

    const loggedIn = req.session.logged_in;
    const userId = loggedIn ? req.session.user_id : '';
    const dashboard = true;

    res.status(200).render('dashboard', { posts, loggedIn, userId, dashboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


    /////////////////////////////////
   //  GET ALL POSTS BY USERNAME  //
  /////////////////////////////////
 //
// sorted by date (newest at the top)
router.get('/posts/:username', async (req, res) => {
  if (req.session.username) {
    if (req.params.username === req.session.username) {
      res.redirect('/dashboard');
      return;
    }
  }
  try {
    const userData = await User.findOne({
      where: { username: req.params.username },
      attributes: ['id', 'username'],
    });

    if (!userData) {
      res.status(404).json({ success: false, message: 'No user found with this username!' });
      return;
    }

    const user = userData.get({ plain: true });

    const postData = await Post.findAll({
      where: { 
        user_id: user.id,
        published: true,
       },
      attributes: { exclude: ['user_id', 'date_created'] },
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'author',
        },
        {
          model: Comment,
          attributes: ['id', 'text', 'date_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
              as: 'author',
            },
          ],
        },
      ],
      order: [
        ['date_published', 'DESC'], // Sort posts by 'date_published' in descending order for published posts
        [Comment, 'date_created', 'DESC'], // sort comments by date_created, newest first
      ], 
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    // console.dir(posts);

    const loggedIn = req.session.logged_in;
    const username = req.params.username;
    const userId = loggedIn ? req.session.user_id : '';

    // res.status(200).json(posts);
    res.status(200).render('posts', { posts, loggedIn, userId, username  });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


    ///////////////////////////////
   //  GET ONE POST BY POST ID  //
  ///////////////////////////////
 //
// comments sorted by date created, newest first
// 
////////////////////////////////////////////////////
router.get('/post/:id', async (req, res) => {
  try{ 
    const postData = await Post.findByPk(req.params.id, {
      attributes: { exclude: ['user_id'] },
      include: [ 
        { 
          model: User,
          attributes: ['username'],
          as: 'author'
        },
        { 
          model: Comment,
          attributes: ['id', 'text', 'date_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
              as: 'author',
            }
          ]
        }
      ],
      order: [[Comment, 'date_created', 'DESC']], // Order comments by date_created, newest first
    });

    if(!postData) {
      res.status(404).json({ success: false, message: 'No post with this id!' });
      return;
    }
    
    const post = postData.get({ plain: true });
    console.dir(post.comments[0]);

    const post_id = req.params.id;
    const loggedIn = req.session.logged_in;

    const dashboard = post.comments[0]
      ? post.comments[0].author.username === req.session.username
      : false;
      const userId = loggedIn ? req.session.user_id : '';
      const username = loggedIn ? req.session.username : '';
    const singlePost = true;
    
    res.status(200).render('post', {
      post, post_id, loggedIn, userId, username, singlePost, dashboard
    });
  } catch (err) {
      res.status(500).json({ success: false, error: err.message });
  };     
});


    ///////////////////////////////////////////////////
   //  GET ALL COMMENTS BY CURRENT USER: DASHBOARD  //
  ///////////////////////////////////////////////////
 //
// comments sorted by date created, newest first
router.get('/dashboard/comments', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      where: { user_id: req.session.user_id },
      attributes: { exclude: ['user_id', 'post_id'] },
      order: [
        ['date_created', 'DESC'],
      ],
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'author',
        },
        {
          model: Post,
          where: { published: true },
          attributes: ['id', 'title', 'content', 'date_published'],
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

    const comments = commentData.map((comment) => comment.get({ plain: true }));
    // console.dir(comments);

    const loggedIn = req.session.logged_in;
    const userId = loggedIn ? req.session.user_id : '';
    const commentsPage = true;
    const dashboardComments = true;

    res.status(200).render('comments', 
      {comments, loggedIn, userId, dashboardComments }
    );
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


    ////////////////////////////////////
   //  GET ALL COMMENTS BY USERNAME  //
  ////////////////////////////////////
 //
// comments sorted by date created, newest first
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
      attributes: { exclude: ['user_id', 'post_id'] },
      order: [
        ['date_created', 'DESC'],
      ],
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'author',
        },
        {
          model: Post,
          attributes: ['id', 'title', 'content'],
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
    // console.dir(comments);

    const loggedIn = req.session.logged_in;
    const userId = loggedIn ? req.session.user_id : '';
    const username = req.params.username;
    const commentsPage = true;

    res.status(200).render('comments', 
      { comments, loggedIn, userId, username, commentsPage }
    );
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


    //////////////////////////////////////////////////
   //  GET ONE COMMENT BY COMMENT ID  (NOT IN USE) //
  //////////////////////////////////////////////////
 //
// 
// router.get('/comment/:id', async (req, res) => {
//   try{ 
//     const commentData = await Comment.findByPk(req.params.id, {
//       attributes: { exclude: ['id', 'user_id', 'post_id'] },
//       include: [ 
//         {
//           model: User,
//           attributes: ['username'],
//           as: 'author',
//         },
//         { 
//           model: Post,
//           attributes: ['id', 'title', 'content'],
//           include: [
//             {
//               model: User,
//               attributes: ['username'],
//               as: 'author'
//             }
//           ]
//         },
//       ],
//     });
//
//     if(!commentData) {
//         res.status(404).json({message: 'No comment with this id!'});
//         return;
//     }
//
//     const comment = commentData.get({ plain: true });
//     console.log(comment);
//
//     const comment_id = req.params.id;
//     const loggedIn = req.session.logged_in;
//
//     res.status(200).json(comment);
//     // res.status(200).render('comment', {comment, comment_id, loggedIn });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   };     
// });


    ///////////////////
   //  LOGIN ROUTE  //
  ///////////////////
 //
//
router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  const loginPage = true;
  res.render('login', { loginPage });
});


    ////////////////////
   //  SIGNUP ROUTE  //
  ////////////////////
 //
//
router.get('/signup', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  const signupPage = true;
  res.render('signup', { signupPage });
});



module.exports = router;
