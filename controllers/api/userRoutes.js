const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/authorize');

// POST SIGNUP route
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;

      res.status(200).json({ success: true, data: userData });
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// GET route to return if username is unique
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // find one user by username
    const existingUser = await User.findOne({
      where: {
        username: username
      }
    });

    // return true (is unique, doesn't exist in database) or false (already in database)
    res.json({ usernameIsUnique: !existingUser })
  } catch(err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// POST LOGIN route to check username & password, and save session data
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;
      
      res.json({ success: true, data: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/logout', withAuth, (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, error: 'Error logging out' });
      } else {
        res.status(204).end();
      }
    });
    res.redirect('/');
  } else {
    // using withAuth, this else will never actually occur
    res.status(500).json({ success: false, error: 'Error logging out' });
  }
});

module.exports = router;
