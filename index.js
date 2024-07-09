require("dotenv").config();
const Express = require("express");
const app = Express();
const port = process.env.PORT;
const Joi = require("joi");
const Mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

app.use(Express.json());

const mysqlconnection = Mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

mysqlconnection.connect((error) => {
  if (error) console.log("database connection failed", error);
  else {
    app.listen(port, () => {
      console.log(`you are using port ${port}`);
    });
  }
});

app.get("/", (req, res) => {
  try {
    const { searchBy } = req.query;

    const limit = parseInt(req.query.limit);
    if (searchBy) {
      mysqlconnection.query(
        {
          sql: `SELECT * FROM articles WHERE category = ? OR title = ? OR publishedYear = ? `,
          values: [searchBy, searchBy, searchBy],
        },
        (error, result, field) => {
          if (error) console.log("search failed", error);
          else {
            res.status(200).json({
              status: "success",
              message: "articles fetched",
              data: result,
            });
          }
        }
      );
    } else {
      if (limit) {
        mysqlconnection.query(
          {
            sql: `SELECT * FROM articles LIMIT ?`,
            values: [limit],
          },
          (error, result, field) => {
            if (error) console.log("search failed", error);
            else {
              res.status(200).json({
                status: "success",
                message: "articles gotten",
                data: result,
              });
            }
          }
        );
      } else {
        mysqlconnection.query(
          {
            sql: `SELECT * FROM articles`,
          },
          (error, result, field) => {
            if (error) console.log("search failed", error);
            else {
              res.status(200).json({
                status: "success",
                message: "articles gotten",
                data: result,
              });
            }
          }
        );
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.post("/user", (req, res) => {
  try {
    const { firstName, lastName, email, phonenumber, password } = req.body;

    const validateusersSchema = Joi.object({
      firstName: Joi.string().alphanum().min(4).max(30).required().messages({
        "string.empty": `"name" can not be empty`,
        "string.min": `"name" should have a minimum length of {#limit}`,
        "string.max": `"name" should be less than {#limit}`,
        "any.required": `"name" is required`,
      }),
      lastName: Joi.string().min(4).max(30).required().messages({
        "string.empty": `"lastName" can not be empty`,
        "string.min": `"lastName" should have a minimum length of {#limit}`,
        "string.max": `"lastName" should be less than {#limit}`,
        "any.required": `"lastName" is required`,
      }),
      email: Joi.string().min(10).max(30).required().messages({
        "string.empty": `"email" can not be empty`,
        "string.min": `"email" should have a minimum length of {#limit}`,
        "string.max": `"email" should be less than {#limit}`,
        "any.required": `"email" is required`,
      }),
      phonenumber: Joi.string().min(5).required().messages({
        "string.empty": `"phonenumber" can not be empty`,
        "string.min": `"phonenumber" should have a minimum length of {#limit}`,
        "any.required": `"phonenumber" is required`,
      }),
      password: Joi.string().alphanum().min(5).max(20).required().messages({
        "string.empty": `"password" can not be empty`,
        "string.min": `"password" should have a minimum length of {#limit}`,
        "string.max": `"password" should be less than {#limit}`,
        "any.required": `"password" is required`,
      }),
    });

    const { error, value } = validateusersSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    if (firstName.charAt(0) == firstName.charAt(0).toLowerCase() ||firstName.charAt(0) == firstName.charAt(0).toLowerCase() ) throw new Error("first character of name and lastname should be in capital letter" );

    let userid = uuidv4();

    mysqlconnection.query(
      {
        sql: `INSERT INTO users(user_id,firstName, lastName, email, phonenumber, password,createdAt) VALUES(?,?,?,?,?,?,?)`,
        values: [userid,firstName,lastName,email,phonenumber,password,new Date()],
      },

      (error, result, field) => {
        if (error) console.log("cannot add user", error);
        else {
          res.status(201).json({
            status: "success",
            message: "user created successfully",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.post("/user-log-in", (req, res) => {
  const { email, password } = req.body;
  try {
    const validatedsignUpSchema = Joi.object({
      email: Joi.string().required().messages({
        "string.empty": `email can not be empty`,
        "any.required": `email is required`,
      }),

      password: Joi.string().required().messages({
        "string.empty": `password can not be empty`,
        "any.required": `password is required`,
      }),
    });

    const { error, value } = validatedsignUpSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    mysqlconnection.query(
      {
        sql: `SELECT * FROM users WHERE email = ? AND password = ?`,
        values: [email, password],
      },
      (error, result, field) => {
        if (error) console.log("request failed", error);
        else {
          res.status(201).json({
            status: "success",
            message: "account fetched successfully",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.patch("/update-user/:id", (req, res) => {
  const { body } = req;
  const id = parseInt(req.params.id);

  try {
    if (!id) throw new Error("invaild id");

    const valiatepatchschema = Joi.object({
      firstName: Joi.string().min(4).max(30).optional().messages({
        "string.empty": `firstname can not be empty`,
        "string.min": `firstname should be longer than {#limit}`,
        "string.max": `firstname should be lesser than {#limit}`,
      }),
      lastName: Joi.string().min(4).max(30).optional().messages({
        "string.empty": `lastname can not be empty`,
        "string.min": `lastname should be longer than {#limit}`,
        "string.max": `lastname should be lesser than {#limit}`,
      }),
      phonenumber: Joi.string().min(8).max(15).optional().messages({
        "string.empty": `firstname can not be empty`,
        "string.min": `firstname should be longer than {#limit}`,
        "string.max": `firstname should be lesser than {#limit}`,
      }),
      password: Joi.string().min(5).max(20).optional().messages({
        "string.empty": `firstname can not be empty`,
        "string.min": `firstname should be longer than {#limit}`,
        "string.max": `firstname should be lesser than {#limit}`,
      }),
    });

    const { error, value } = valiatepatchschema.validate(req.body);

    if (error) throw new Error(error.details[0].message);

    let query1 = Object.keys(req.body);

    let values = Object.values(req.body);

    let query2 = query1.map((ele) => ele + " =?");
    query2 = query2.join(",");

    mysqlconnection.query(
      {
        sql: `UPDATE users SET ${query2}, updatedAt = ? WHERE sn =?`,
        values: [...values, new Date(),id]
      },
      (error, result, field) => {
        if (error) console.log("update failed", error);
        else {
          res.status(200).json({
            status: "success",
            message: "account updated",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.delete("/remove-user/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) throw new Error("invalid id");

    mysqlconnection.query(
      {
        sql: `DELETE FROM users WHERE sn = ?`,
        values: [id],
      },
      (error, result, field) => {
        if (error) console.log("falied to delete account", error);
        else {
          res.status(200).json({
            status: "success",
            message: `account deleted successfully`,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.post("/create-article", (req, res) => {
  const { title, author, authorEmail, category, publishedYear } = req.body;

  try {
    const validateArticleSchema = Joi.object({
      title: Joi.string().min(4).max(50).required().messages({
        "string.empty": `"title" can not be empty`,
        "sting.min": `"title" should have a minimum length of {#limit}`,
        "string.max": `"title" should be less than {#limit}`,
        "any.required": `"title" is required`,
      }),
      author: Joi.string().min(4).max(30).required().messages({
        "string.empty": `"author" can not be empty`,
        "string.min": `"author" should have a minimum length of {#limit}`,
        "string.max": `"author" should be less than {#limit}`,
        "any.required": `"author" is required`,
      }),
      authorEmail: Joi.string().min(4).max(30).required().messages({
        "string.empty": `"authorEmail" can not be empty`,
        "string.min": `"authorEmail" should have a minimum length of {#limit}`,
        "string.max": `"authorEmail" should be less than {#limit}`,
        "any.required": `"authorEmail" is required`,
      }),
      category: Joi.string().min(4).max(30).required().messages({
        "string.empty": `"category" can not be empty`,
        "string.min": `"category" should have a minimum length of {#limit}`,
        "string.max": `"category" should be less than {#limit}`,
        "any.required": `"category" is required`,
      }),
      publishedYear: Joi.number().min(4).max(2024).required().messages({
        "number.base": `"publishedYear" must be a number`,
        "number.min": `"publishedYear" should have a minimum length of {#limit}`,
        "number.max": `"publishedYear" should be less than {#limit}`,
        "any.required": `"publishedYear" is required`,
      }),
    });

    const { error, value } = validateArticleSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let articleId = uuidv4();

    mysqlconnection.query(
      {
        sql: `INSERT INTO articles(article_id,title, author, authorEmail, category, publishedYear,createdAt) VALUES(?,?,?,?,?,?,?)`,
        values: [articleId,title,author,authorEmail,category,publishedYear,new Date()]
      },

      (error, result, field) => {
        if (error) console.log("failed to create article", error);
        else {
          res.status(200).json({
            status: "success",
            message: "new article created successfully",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.get("/article/:id", (req, res) => {
  const id = parseInt(req.params.id);
  try {
   if(!id) throw new Error("invalid id")
    mysqlconnection.query(
  {
    sql:`SELECT * FROM articles WHERE sn = ?`,
    values:[id]
  }, 
  (error,result,field) =>{
    if(error) throw new Error("request failed")
      else{
        if(result.length === 0) {
          res.status(200).json({
            status: "success",
            message: "article not found"
          });
        }
          
        else{
        res.status(200).json({
          status: "success",
          message: `${result.title} article fetched successfully`,
          data: result,
        });
          }
     }
  }
    )

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.patch("/update-article/:id", (req, res) => {
  try {
    const { body } = req;
    const id = parseInt(req.params.id);
    if (!id) throw new Error("invaild id");

    const validateArticlePatchSchema = Joi.object({
      title: Joi.string().min(4).max(50).optional().messages({
        "string.empty": `"title" can not be empty`,
        "sting.min": `"title" should have a minimum length of {#limit}`,
        "string.max": `"title" should be less than {#limit}`,
      }),
      author: Joi.string().min(4).max(30).optional().messages({
        "string.empty": `"author" can not be empty`,
        "string.min": `"author" should have a minimum length of {#limit}`,
        "string.max": `"author" should be less than {#limit}`,
      }),
      authorEmail: Joi.string().min(4).max(30).optional().messages({
        "string.empty": `"authorEmail" can not be empty`,
        "string.min": `"authorEmail" should have a minimum length of {#limit}`,
        "string.max": `"authorEmail" should be less than {#limit}`,
      }),
      category: Joi.string().min(4).max(30).optional().messages({
        "string.empty": `"category" can not be empty`,
        "string.min": `"category" should have a minimum length of {#limit}`,
        "string.max": `"category" should be less than {#limit}`,
      }),
      publishedYear: Joi.number().min(4).max(2024).optional().messages({
        "number.base": `"publishedYear" must be a number`,
        "number.min": `"publishedYear" should have a minimum length of {#limit}`,
        "number.max": `"publishedYear" should be less than {#limit}`,
      }),
    });

    const { error, value } = validateArticlePatchSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let queries= Object.keys(req.body).map((ele) => `${ele}=?`).join(",")
    console.log(queries)
    let values = Object.values(req.body)

   mysqlconnection.query(
    {
       sql: `UPDATE articles SET ${queries}, updatedAt =? WHERE sn=?`,
       values:[...values,new Date(), id]
    },

    (error,result,field) =>{
      if(error) console.log("failed to update article", error)
        else{
      res.status(200).json({
        status: "success",
        message: `updated successful`,
        data: result
      });
      }
    }
   )


  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.delete("/remove-article/:id", (req, res) => {
  const id = parseInt(req.params.id);
  try {
    if (!id) throw new Error("invalid id");

    mysqlconnection.query(
      {
        sql: `DELETE FROM articles WHERE sn = ?`,
        values: [id],
      },
      (error, result, field) => {
        if (error) console.log("falied to delete article", error);
        else {
          res.status(200).json({
            status: "success",
            message: `article deleted successfully`,
          });
        }
      }
    );

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.post("/category", (req, res) => {
  try {
    const { name } = req.body;

    const validateCategorySchema = Joi.object({
      name: Joi.string().min(3).max(20).required().messages({
        "string.empty": `"name" can not be empty`,
        "string.min": `"name" should be longer than {#limit}`,
        "string.max": `"name" should be lesser than {#limit}`,
      }),
    });

    const { error, value } = validateCategorySchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

  let categoryid= uuidv4()
    mysqlconnection.query(
      {
        sql: `INSERT INTO categories(category_id,name,createdAt) VALUES(?,?,?)`,
        values: [categoryid,name,new Date()]
      },
      (error, result, field) => {
        if (error) console.log("falied to create category", error);
        else {
          res.status(200).json({
            status: "success",
            message: `category created successfully`,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.get("/categories", (req, res) => {
  try {
   
    mysqlconnection.query(
        {
          sql: `SELECT * FROM categories`
        },
        (error, result, field) => {
          if (error) console.log("falied to fetch category", error);
          else {
            res.status(200).json({
              status: "success",
              message: `category fetched successfully`,
              data:result
            });
          }
        }
      );
        
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    })
  }
});

// app.get("/category/:id", (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const limit = parseInt(req.query.limit);

//     if (!id) throw new Error("invalid id");

//     if (limit){
//       mysqlconnection.query(
//         {
//           sql: `SELECT * FROM categories WHERE sn = ? LIMIT =?`,
//           values: [id,limit],
//         },
//         (error, result, field) => {
//           if (error) console.log("falied to fetch category", error);
//           else {
//             res.status(200).json({
//               status: "success",
//               message: `category fetched successfully`,
//               data:result
//             });
//           }
//         }
//       );
//     }
//      else{
//       mysqlconnection.query(
//         {
//           sql: `SELECT * FROM categories WHERE sn = ?`,
//           values: [id],
//         },
//         (error, result, field) => {
//           if (error) console.log("falied to fetch category", error);
//           else {
//             res.status(200).json({
//               status: "success",
//               message: `category fetched successfully`,
//             });
//           }
//         }
//       );
//      }
    
//   } catch (error) {
//     res.status(500).json({
//       status: "failed",
//       message: error.message,
//     });
//   }
// });

app.patch("/update-category/:id", (req, res) => {
  try {
    const { body } = req;
    const id = parseInt(req.params.id);
    if (!id) throw new Error("invaild id");

    const validatePatchCategorySchema = Joi.object({
      name: Joi.string().min(3).max(20).required().messages({
        "string.empty": `"name" can not be empty`,
        "string.min": `"name" should be longer than {#limit}`,
        "string.max": `"name" should be lesser than {#limit}`,
      }),
    });

    const { error, value } = validatePatchCategorySchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let values = Object.values(req.body)
    let queries= Object.keys(req.body).map((ele) => `${ele} =?`).join(",")
    console.log(queries)

    mysqlconnection.query(
      {
        sql: `UPDATE categories SET ${queries}, updatedAt = ? WHERE sn = ?`,
        values:[...values,new Date(), id]
      },

      (error,result,field) =>{
       if(error) console.log("update failed", error)
        else{
      res.status(200).json({
        status: "success",
        message: "category updated successfully",
        data: result
      });
      
        }
      }
    )

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.delete("/remove-category/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) throw new Error("invaild id");
    
  mysqlconnection.query(
   {
     sql: `DELETE FROM categories WHERE sn = ?`,
     values: [id],
   },
   (error, result, field) => {
     if (error) console.log("falied to delete category", error);
     else {
       res.status(200).json({
         status: "success",
         message: `category deleted successfully`,
       });
     }
   }
 );
   
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});