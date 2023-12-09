# tech-blog

## Description 

Your GitHub profile is an extremely important aspect of your public identity as a developer. A well-crafted one allows you to show off your work to other developers as well as potential employers. An important component of your GitHub profile—and one that many new developers often overlook—is the README.md file.

The quality of a README often differentiates a good project from a bad project. A good one takes advantage of the opportunity to explain and showcase what your application does, justify the technologies used, and even talk about some of the challenges you faced and features you hope to implement in the future. A good README helps you stand out among the large crowd of developers putting their work on GitHub.

There's no one right way to structure a good README. There is one very wrong way, however, and that is to not include a README at all or to create a very anemic one. This guide outlines a few best practices. As you progress in your career, you will develop your own ideas about what makes a good README.

At a minimum, your project README needs a title and a short description explaining the what, why, and how. What was your motivation? Why did you build this project? (Note: The answer is not "Because it was a homework assignment.") What problem does it solve? What did you learn? What makes your project stand out? 

Lastly, if your project is deployed, include a link to the deployed application here.

If you're new to Markdown, read the GitHub guide on [Mastering Markdown](https://guides.github.com/features/mastering-markdown/).

If you need an example of a good README, check out [the VSCode repository](https://github.com/microsoft/vscode).


## Installation

What are the steps required to install your project? Provide a step-by-step description of how to get the development environment running.


## Usage 

Provide instructions and examples for use. Include screenshots as needed. 

To add a screenshot, create an `assets/images` folder in your repository and upload your screenshot to it. Then, using the relative filepath, add it to your README using the following syntax:

```md
![alt text](assets/images/screenshot.png)
```


## Credits

List your collaborators, if any, with links to their GitHub profiles.

If you used any third-party assets that require attribution, list the creators with links to their primary web presence in this section.

If you followed tutorials, include links to those here as well.


## License

Please refer to the LICENSE in the repo.


---


## Features

If your project has a lot of features, consider adding a heading called "Features" and listing them there.


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
