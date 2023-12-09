# tech-blog

## Description 

For this project I wanted to build a content management system (CMS) style blog site similar to [Medium](https://medium.com/) where developers can publish their blog posts adn comment on other developers' posts as well. I followed the Model-View-Controller (MVC) paradigm, although because of some of the complexity of user interactions, the View and Controller portions were somewhat intertwined. I used Handlebars.js as the templating language, Sequelize for Object-Relational Mapping (ORM), and Express-Session for authentication.

This project has been deployed to [Heroku](https://www.heroku.com/) and can be accessed [here](https://technology-blog-mvc-bc5dd727c749.herokuapp.com/).


## Features

If your project has a lot of features, consider adding a heading called "Features" and listing them there.


## Installation

What are the steps required to install your project? Provide a step-by-step description of how to get the development environment running.


## Usage 

Provide instructions and examples for use. Include screenshots as needed. 

To add a screenshot, create an `assets/images` folder in your repository and upload your screenshot to it. Then, using the relative filepath, add it to your README using the following syntax:

```md
![alt text](assets/images/screenshot.png)
```


## Credits

I used the following software packages in this project:
- [Express](https://www.npmjs.com/package/express) to manage routing
- [express-session](https://www.npmjs.com/package/express-session) for session management
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
- [MySQL2](https://www.npmjs.com/package/mysql2) to create a relational database for application data
- [Sequelize](https://www.npmjs.com/package/sequelize) to interact with and manage a MySQL database
- [connect-session-sequelize](https://www.npmjs.com/package/connect-session-sequelize) for session management using Sequelize as the session store
- [Dotenv](https://www.npmjs.com/package/dotenv) to load environment variables from a ```.env``` file into ```process.env```
- [Handlebars](https://handlebarsjs.com/) with [Express Handlebars](https://www.npmjs.com/package/express-handlebars) as a templating engine to generate dynamic HTML
- [Bootstrap](https://www.npmjs.com/package/bootstrap) for styling and page components including modals
- [Nodemon](https://www.npmjs.com/package/nodemon) for automatic application restart on file change during development



## License

Please refer to the LICENSE in the repo.


---


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
