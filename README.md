# tech-blog

## Description 

For this project I wanted to build a content management system (CMS) style blog site similar to [Medium](https://medium.com/) where developers can publish their blog posts adn comment on other developers' posts as well. I followed the Model-View-Controller (MVC) paradigm, although because of some of the complexity of user interactions, the View and Controller portions were somewhat intertwined. I used Handlebars.js as the templating language, Sequelize for Object-Relational Mapping (ORM), and Express-Session for authentication.

This project has been deployed to [Heroku](https://www.heroku.com/) and can be accessed [here](https://technology-blog-mvc-bc5dd727c749.herokuapp.com/).

## Features

### Sliding Interface

When posts are clicked on, 


## Installation

To install the application locally, copy the files and folders to the desired location. From the root directory, enter the command
```
npm install
```
to install dependencies.

To seed the database with example data, enter the command
```
npm run seed
```

## Usage 

The application can be run from its deployed location [here](https://technology-blog-mvc-bc5dd727c749.herokuapp.com/).

To run it locally, enter the command
```
npm run start
```
from the root directory. Then open the following address in your web browser:
```
http://localhost:3001
```

When opened, the **Home page** is displayed, showing a navigation bar with **Home**, **Dashboard**, and **Login**, and a listing of published post titles with dates and author usernames.

![alt text](assets/images/screenshot.png)

Clicking on a post causes the content to "un-collapse" and reveal the post content and a **Comments** header.

![alt text](assets/images/screenshot.png)

"Clicking on the **Comments** header "un-collapses" the comments, if any.

![alt text](assets/images/screenshot.png)

If the post title is clicked, a single-post view will be displayed. Clicking on any post title on any page throughout the site will always bring the user to this single-post view.

![alt text](assets/images/screenshot.png)

If a username is clicked on any page throughout the site, whether a post or a comment author, an **All Posts by...** view will be displayed. These posts and their comments can be clicked on and expanded just like on the **Home page**.

![alt text](assets/images/screenshot.png)

If the **See all comments by...** link is clicked, an **All Comments by...** view will be displayed, showing all that user's comments and comment dates with their associated posts titles and post dates.

![alt text](assets/images/screenshot.png)

Clicking on the post-comment pair will cause the post to "un-collapse" and reveal the post's content and author. A **See all posts by...** link at the bottom of the page returns the user to the **All Posts by...** page.

![alt text](assets/images/screenshot.png)

Clicking on the **Dashboard** or **Login** navigation links will take the user to the **Login page**. The user can choose to login or alternatively click the **Sign Up** button.

![alt text](assets/images/screenshot.png)

On the **Sign Up page**, the user can create an account with a username, email and password. The username is checked against existing usernames as each character is entered; the input is changed to red text and a warning messaged is displayed if the user types a username that is already in use. The **Submit** is disabled if the username is not at least three characters.

![alt text](assets/images/screenshot.png)

When the email input field loses focus, the entered email address is validated against a standard format. If the entered email address does not match a valid format, the input field is cleared and the user is warned with a modal.

![alt text](assets/images/screenshot.png)

On clicking the **Submit** button, additional checks are performed. If any field is empty, the user is warned. If the two passwords don't match, the password input fields are cleared and the user is warned with a modal.

![alt text](assets/images/screenshot.png)

On successful login or sign up, the authenticated user will be returned to the home page. Now if the user expands a post and comments, a **New Comment** button will appear, and the user can create new comments on any post.

![alt text](assets/images/screenshot.png)

On clicking the **New Comment** button, the authenticated user is brought to the single-post page again, this time with a comment input field available for text entry, with **Save** and **Cancel** buttons. If the user clicks **Save**, the new comment is added to the database and displayed under the post. If the user clicks **Cancel**, the new comment is discarded.

![alt text](assets/images/screenshot.png)


![alt text](assets/images/screenshot.png)

On clicking the **Dashboard** navigation link, the authenticated user is brought to the **Dashboard My Posts page**. The user's posts, if any will be listed by title and publication date. A **New Post** button is also displayed.

![alt text](assets/images/screenshot.png)

If the user clicks on a post, it "un-collapses" and three additional buttons are displayed: **Edit**, **Delete**, and **Unpublish**. If the revealed **Comments** header is clicked, the comments are expanded and a **New Comment** button is also displayed, if the user wants to comment on their own post.

![alt text](assets/images/screenshot.png)

If the user clicks the **Edit** button, the post title and content are changed to text entry fields and can be modified. **Save** and **Cancel** buttons are also displayed.

If the user clicks the **Cancel** button, any changes are discarded and the unchanged post is restored. If the user clicks the **Save** button, any changes are updated to the database.

![alt text](assets/images/screenshot.png)

If the user clicks the **Delete** button, a warning and request for confirmation is displayed. Clicking **OK** will delete the post from the database. Clicking **Cancel** will cancel the delete request.

![alt text](assets/images/screenshot.png)

If the user clicks the **Unpublish** button, the publication data is changed to ```DRAFT``` and the post will not be displayed to other users on any page. The button becomes a **Publish** button, and if clicked will restore published status with the current date.

![alt text](assets/images/screenshot.png)

If the user clicks the **New Post** button, title and post body text entry fields for a new post will be displayed along with **Save** and **Cancel** buttons. 

If the user clicks the **Cancel** button, the new post with any input is discarded. If the user clicks the **Save** button, the post is saved to the database with DRAFT status. The **Save** and **Cancel** buttons are replaced with **Edit**, **Delete**, and **Publish** buttons. Once the user clicks the **Publish** button, the new post is given a publication data and will be visible to other users.

![alt text](assets/images/screenshot.png)

If the user clicks the **Logout** navigation link, their session will be ended and they will be returned to the login page. Additionally, if the session cookie expires, they will also be logged out. Any page requests or attempts to perform actions requiring authentication, such as creating a post or adding a comment, will be redirected to the login page.


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
