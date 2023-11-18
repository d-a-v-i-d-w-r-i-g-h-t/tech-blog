const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const posts = await Promise.all(
    postData.map(async (post) => {
      const newDate = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
      const createdPost = await Post.create({
        ...post,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        date_created: newDate,
        date_published: newDate,
        published: true,
      });
      return createdPost;
    })
  );

  for (const comment of commentData) {
    await Comment.create({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      post_id: posts[Math.floor(Math.random() * posts.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();



