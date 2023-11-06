# tech-blog


## Pseudocode

### Files & Folders

Creating directories within the convention of MVC (Model-View-Control)
- config
  - connection.js
- controllers
  - api
    - index.js
    - user-routes.js
  - home-routes.js
  - index.js
- db
  - schema.sql
- models
  - Comment.js
  - index.js
  - Post.js
  - User.js
- public
  - css
    - jass.css
    - style.css
  - images
  - js
    - login.js
    - logout.js
- seeds
- utils
  - helpers.js
- views
  - layouts
  - partials
- .env
- .gitignore
- server.js

### Models

setting up the database

- User (1-to-many)
  - id (primary key)
  - username
  - password
  - encrypt password, need some hooks

- Post (1-to-many)
  - id (primary key)
  - title
  - content
  - user_id (foreign key)
  - date/timestamp (can be automatically added if set up right)

- Comment (1-to-many)
  - id (primary key)
  - content
  - user_id (foreign key)
  - post_id (foreign key)
  - date/timestamp (can be automatically added if set up right)

Associations (index.js)

- User has many Post
- User has many Comment
- Post has many Comment

### Views

- handlebars js
- login/signup
- homepage
- dashboard
- post
  - comments / newcomment-partial
  - new-post (edit post)
- folders for layouts and partials if you plan to use them
  - layouts main? partials post/comment?

### Controllers

- routes! /api/ and home
- index
  - apiRoutes
    - userRoutes

    - postRoutes
    - commentRoutes
  - homeroutes (all get requests)
    - '/' (all posts)
    - '/
    - '/post/:id' (one post with all comments)
    - '/login/' (login/signup)
    - '/user/:id' (for the dashboard: all user posts)
- /api/ index, user, (blog)post, comments
  - get, post, put, delete
  - index -> userroutes, postroutes, commentroutes
  - (blog)post -> :id, title, description, user
  - user -> :id, username, password
  - comments -> :id, description (includes)
    - need post, update, and delete

### Basics

- server.js, .env, .gitignore, readme
- public (css, img, js)
- config (connection)
- db (schema)
- seeds (index, postData, commentData)
- utils (auth, helpers)

### Server

- NPMs
  - path
  - express
  - express-session
  - express-handlebars
  - sequelize
  - dotenv
- helpers
- middleware
  - app.use
  express.json/urlencoded/static(public)
  - engine, handlebars, helpers, session
- session: secret, cookie
