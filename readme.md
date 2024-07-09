-- How To Set Up The Content Management System API

* initialize a node package environment with the key word - npm init  OR     npm init -y.
* install express as a dependency with - npm i express --save    OR     npm install express .
* instal a dotenv package to keep sensitive data in the app with - npm i dotenv --save.
* install a nodemon package to constantly track the server as a development dependency with - npm i nodemon -D .
* install joi for data validation with - npm i joi --save.
Note: npm i will help install these packages except the development dependencies.

* create a .env file, .env.example file and an index.js file.
Note: add your node_modules and .env file to the gitignore file.

* require the dotenv package in the index.js file by - require("dotenv").config().
* require the express package in the index.js file by - const Express = require("express).
* create an instance to call the express function using - const app = Express().
*  require the joi package in the index.js file by - const Joi = require("joi")
* create a port for the app with - const port = process.env.PORT 
because our port number is a sensitive data, we add it to our .env file. we equate the port number to PORT which is what .env would be processing in the index.js file eg PORT = 2114
* then our .env.example would hold the variabes with sensitive data without the data.
therefore: 
.env would have - const PORT = 2114
.env.example would have - const PORT =
index.js would have const port = process.env.PORT

*  in order to translate whatever data is coming with the HTTP methods to javascript local library we use the middleware
 express.json() -      app.use(Epxress.json())
* lastly, app.listen(port,()=>) allows the server to listen/run request on a specific port.

**** we have succefully spinned a server.


-- How To Use The End Points.


### The first end point is the landing page
$ by default functions as a get all article request, sorted by title in ascending order.
$ if there is a query search, data is fetched from the database, if the searched word is included in any of the elements in the dummy database.
$ if there is a query for limit the number of articles fetched is based on the number assigned to limit. 
$ it uses the GET HTTP method 
SAMPLE REQUEST - localhost:2114/
SAMPLE RESPONSE - All ARTICLES ASCENDING ORDER

SAMPLE REQUEST - localhost:2114/?searchBy=africa
SAMPLE RESPONSE - RETURS ALL ELEMENTS THAT INCLUDES VALUE IN SEARCHBY

SAMPLE REQUEST - localhost:2114/?limit=5
SAMPLE RESPONSE -  ALL ARTICLES BY ASCENDING BUT LIMITS IT TO 5
         res.status(200).json({
        status: "success",
        message: "articles fetched successfully",
        data: fetched
      })




### The second Endpoint create new users in the database
$ every user's email address is unique, if a new user tries to sign in with an existing email and error is thrown to prevent the event.
$ it uses the POST HTTP method

SAMPLE REQUEST - localhost:2114/user
SAMPLE RESPONSE - A NEW USER IS CREATED IN THE DATABASE WITH THE DATA PROVIDED IN THE BODY.
     res.status(200).json({
    status: "success",
    message: `user ${newUser.firstName} created successfully`,
    data: newUser
 })




### the third end point logs-in users using their email address and their password

$ it uses the POST HTTP method

SAMPLE REQUEST - localhost:2114/user-log-in
SAMPLE RESPONSE - RETURNS USER DATA WITH MATCHING EMAIL AND PASSWORD.
           res.status(200).json({
          status: "success",
          message: `${finduser.firstName} logged in successfully`,
          data: finduser
        });

### the fourth end point updates a user's account 
$ it recieves a body containing a key and value of the intended update
$ and also a params that uniquely identifies the account to be updated
$ it uses the PATCH HTTP method

SAMPLE REQUEST - localhost:2114/update-user/:id
SAMPLE RESPONSE - RETURNS AN UPDATED VERSION OF THE USER DETAILS.
          res.status(200).json({
          status: "success",
          message: "user account updated successfully",
          data: [Users[finduser], Users]
        });

 ### the fifth end point deletes a user account 

$ a check is done to ensure the user has not created an article by comparing all author's email to the user email, if the there is a match access to delete account is denied.
$ and also a params that uniquely identifies the account to be deleted.
$ it uses the DELETE HTTP method

SAMPLE REQUEST - localhost:2114/delete-user/:id
SAMPLE RESPONSE - 
      res.status(200).json({
      status: "success",
      message: `account deleted successfully`
    })


 ### the sixth endpoint creates a new article 
 
 $ every title of an article is unique, if a duplicate title comes with the body an error  message is thrown saying that such article exists.
 $ it uses the POST HTTP method

SAMPLE REQUEST - localhost:2114/create-article
SAMPLE RESPONSE - 
      res.status(200).json({
    status : "success",
    message : "new article created successfully",
    data : newArticle
    })


### the seventh endpoint fetches a single article
$ a request is gotten through req.params
$ the params  is compared to the articles and an article that uniquely matches the params is returned.
$ it uses the GET HTTP method.

SAMPLE REQUEST - localhost:2114/article/:id
SAMPLE RESPONSE - 
       res.status(200).json({
      status: "success",
      message: `${findarticle.title} article fetched successfully`,
      data: findarticle,
    });

### the eighth endpoint updates an article
$ a request is gotten through the req.params
$ the params is compared to with all articles in the database and an article that uniquely matches the params is returned
$ an updated is done on the article and the updated time is included.
$ it uses the PATCH HTTP method

SAMPLE REQUEST - localhost:2114/update-article/:id
SAMPLE RESPONSE - 
      res.status(200).json({
  status: "success",
  message : `${Articles.title} updated successfully`,
  data: Articles[findarticle]
 })

 ### the ninth endpoint deletes an article from the database
 $ it recieves a delete request, using the params to fetch a matching article that the params uniquely matches
 $ it uses the DELETE HTTP method.

SAMPLE REQUEST - localhost:2114/remove-article/:id
SAMPLE RESPONSE - 
 res.status(200).json({
    status: "success",
    message: "article removed successfully"
  })    

### the tenth endpoint creates a category
$ it recieves a body with data the category dummy database requires.
$if there is an existing category and error is thrown.
$ it uses the POST HTTP method

SAMPLE REQUEST - localhost:2114/category
SAMPLE RESPONSE - 
res.status(201).json({
  status: "success",
  message: `${newcategory.name} category created successfully`,
  data: newcategory
});

### the eleventh endpoint fetches all categories
$ all categories are sorted in an ascending order
$ it uses the GET HTTP method

SAMPLE REQUEST - localhost:2114/categories
SAMPLE RESPONSE - 
 res.status(200).json({
    status:"success",
    message: "categories fetched successfully",
    data: Categories
   });


 ### the twelveth endpoint picks a single category and fetches all articles in the Articles database that matches the category.
 $ it uses the params to check for a matching articles that uniquely identifies with the params.
 $ filters all articles in the articles that matches the category 
 $ returns them based on a limit if specified 
 $ it uses the GET HTTP method

SAMPLE REQUEST - localhost:2114/category/:id
SAMPLE RESPONSE - 
 res.status(200).json({
    status: "success",
    message : "articles fetched successfully",
    data: findArticleByCategory
  })

  ### the thirteenth endpoint updates a category 
  $ it uses the params to uniquely identify the category to be updated 
  $ it uses the PATCH HTTP method

SAMPLE REQUEST - localhost:2114/update-category/:id
SAMPLE RESPONSE - 
  res.status(200).json({
      status: "success",
      message: "category updated successfully",
      data: Categories[findcategory],
    });

 ### the fourtheenth endpoint delete's a category
 $ it uses a the params to find a matching category 
 $ it aslo checks if the category has existing articles in the database, if there are articles with such category and error message would be thrown to prevent the event.
 $ it uses the DELETE HTTP method
 SAMPLE REQUEST - localhost:2114/remove-category/:id
SAMPLE RESPONSE - 
     res.status(200).json({
      status: "success",
      message: "category removed successfully",
    });