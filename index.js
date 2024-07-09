require("dotenv").config();
const Express = require("express");
const app = Express();
const port = process.env.PORT;
const Joi = require("joi");

app.use(Express.json());

app.listen(port, () => {
  console.log(`you are using port ${port}`);
});

const Users = [
  {
    id: 1,
    firstName: "zaianb",
    lastName: "Arowojobe",
    email: "zamababy@gmail.com",
    phonenumber: "08023554768",
    password: "zeebaby",
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },

  {
    id: 2,
    firstName: "fatimah",
    lastName: "Arowojobe",
    email: "fatibabybaby@gmail.com",
    phonenumber: "08023554768",
    password: "fatibaby",
    createdAt: "2024-05-26T09:03:14.237Z",
    updatedAt: null,
  },

  {
    id: 3,
    firstName: "Maraiam",
    lastName: "Balogun",
    email: "marubaby@gmail.com",
    phonenumber: "08023554768",
    password: "maribaby",
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },
];

const Articles = [
  {
    id: 1,
    title: "African politics",
    author: "Maraiam Balogun",
    authorEmail: "marubaby@gmail.com",
    category: "politics",
    publishedYear: 2016,
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },
  {
    id: 2,
    title: "Yesterday and it's trends",
    author: "Thomas Adekule",
    authorEmail: "thomas@gmail.com",
    category: "fashion",
    publishedYear: 2001,
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },
  {
    id: 3,
    title: "How to write a comprehensive ",
    author: "Bolaji Badmus",
    authorEmail: "bola@gmail.com",
    category: "research",
    publishedYear: 2009,
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },
  {
    id: 4,
    title: "living with family",
    author: "Mary Sunray",
    authorEmail: "sunray@gmail.com",
    category: "lifestyle",
    publishedYear: 2017,
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },
  {
    id: 5,
    title: "world war",
    author: "samuel shitta",
    authorEmail: "shitta@gmail.com",
    category: "history",
    publishedYear: 2011,
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },
  {
    id: 6,
    title: "travelling through shahara",
    author: "musa Bawhala",
    authorEmail: "bawhala@gmail.com",
    category: "travel",
    publishedYear: 2002,
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },
  {
    id: 7,
    title: "what colour says about your space",
    author: "Zainab Arowojobe",
    authorEmail: "marubaby@gmail.com",
    category: "aesthetics",
    publishedYear: 2009,
    createdAt: "2024-06-26T09:03:14.237Z",
    updatedAt: null,
  },
];

const Categories = [
  {
    id: 1,
    name: "history",
    createdAt: "2024-07-01T00:41:19.969Z",
    updatedAt: null,
  },
  {
    id: 2,
    name: "aesthetics",
    createdAt: "2024-07-01T00:41:19.969Z",
    updatedAt: null,
  },
  {
    id: 3,
    name: "travel",
    createdAt: "2024-07-01T00:41:19.969Z",
    updatedAt: null,
  },
  {
    id: 4,
    name: "politics",
    createdAt: "2024-07-01T00:41:19.969Z",
    updatedAt: null,
  },
  {
    id: 5,
    name: "research",
    createdAt: "2024-07-01T00:41:19.969Z",
    updatedAt: null,
  },
  {
    id: 6,
    name: "lifestyle",
    createdAt: "2024-07-01T00:41:19.969Z",
    updatedAt: null,
  },
  {
    id: 7,
    name: "fashion",
    createdAt: "2024-07-01T00:41:19.969Z",
    updatedAt: null,
  },
  {
    id: 8,
    name: "technology",
    createdAt: "2024-07-01T00:41:19.969Z",
    updatedAt: null,
  }
];

app.get("/", (req, res) => {
  try {
    const { searchBy } = req.query;
    let fetched = Articles;
    const limit = parseInt(req.query.limit);
    if (searchBy) {
      let filterarticle = Articles.filter((ele) => Object.values(ele).join("").toLowerCase().includes(searchBy.toLowerCase()));

      if (filterarticle) fetched = filterarticle;

      if (filterarticle.length === 0) throw new Error("article not found");
    }

    fetched.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);

    if (limit) fetched.length = limit;

    res.status(200).json({
      status: "success",
      message: "articles fetched successfully",
      data: fetched,
    });
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

    if (firstName.charAt(0) == firstName.charAt(0).toLowerCase() || firstName.charAt(0) == firstName.charAt(0).toLowerCase()) throw new Error("first character of name and lastname should be in capital letter");

    if (Users.find((ele) => ele.email === email)) throw new Error("user already exist");

    let newUser = {
      id: Users.length + 1,
      firstName,
      lastName,
      email,
      phonenumber,
      password,
      createdAt: new Date(),
      updatedAt: null,
    };
    Users.push(newUser);
    res.status(200).json({
      status: "success",
      message: `user created successfully`,
      data: newUser,
    });
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

    let finduser = Users.find(
      (ele) => ele.password === password && ele.email === email
    );
    if (!finduser) throw new Error("invalid credentials");

    res.status(200).json({
      status: "success",
      message: `${finduser.firstName} logged in successfully`,
      data: finduser,
    });
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

    let finduser = Users.findIndex((ele) => ele.id === id);
    if (finduser === -1) throw new Error("user account does not exist");

    Users[finduser] = { ...Users[finduser], ...body, updatedAt: new Date() };

    res.status(200).json({
      status: "success",
      message: "user account updated successfully",
      data: [Users[finduser], Users],
    });
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

    let finduser = Users.findIndex((ele) => ele.id === id);
    if (finduser === -1) throw new Error("account not found");
    let findIfArticle = Articles.find((ele) => ele.authorEmail === Users[finduser].email);

    if (findIfArticle)throw new Error("you have created an article,can not delete account");

    Users.splice(finduser, 1);

    res.status(200).json({
      status: "success",
      message: `account deleted successfully`,
    });
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
    if (Articles.find((ele) => ele.title === title)) throw new Error("article already exists");

    let newArticle = {
      id: Articles.length + 1,
      title,
      author,
      authorEmail,
      category,
      publishedYear,
      createdAt: new Date(),
      updatedAt: null,
    };
    Articles.push(newArticle);

    res.status(200).json({
      status: "success",
      message: "new article created successfully",
      data: newArticle,
    });
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
    if (!id) throw new Error("invalid id");
    let findarticle = Articles.find((ele) => ele.id === id);
    if (!findarticle) throw new Error("article not found");

    res.status(200).json({
      status: "success",
      message: `${findarticle.title} article fetched successfully`,
      data: findarticle,
    });
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

    let findarticle = Articles.findIndex((ele) => ele.id === id);

    if (findarticle === -1) throw new Error("article not found");
    Articles[findarticle] = { ...Articles[findarticle], ...body, updatedAt: new Date()};

    res.status(200).json({
      status: "success",
      message: `${Articles.title} updated successfully`,
      data: Articles[findarticle],
    });
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

    let findarticle = Articles.findIndex((ele) => ele.id === id);
    if (findarticle === -1) throw new Error("account does not exist");

    Articles.splice(findarticle, 1);
    res.status(200).json({
      status: "success",
      message: "article removed successfully",
    });
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
    if (Categories.find((ele) => ele.name === name))   
      throw new Error("category exist already");

    const validateCategorySchema = Joi.object({
      name: Joi.string().min(3).max(20).required().messages({
        "string.empty": `"name" can not be empty`,
        "string.min": `"name" should be longer than {#limit}`,
        "string.max": `"name" should be lesser than {#limit}`,
      }),
    });

    const { error, value } = validateCategorySchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let newcategory = {
      id: Categories.length + 1,
      name,
      createdAt: new Date(),
      updatedAt: null,
    };
    Categories.push(newcategory);

    res.status(201).json({
      status: "success",
      message: `${newcategory.name} category created successfully`,
      data: newcategory,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.get("/categories", (req, res) => {
  try {
    Categories.sort((a, b) => (a.name > b.name ? 1 : -1));

    res.status(200).json({
      status: "success",
      message: "categories fetched successfully",
      data: Categories,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

app.get("/category/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const limit = parseInt(req.query.limit);

    if (!id) throw new Error("invalid id");
    let findcategory = Categories.find((ele) => ele.id === id);
    if (!findcategory) throw new Error("category not found");
    let findArticleByCategory = Articles.filter((ele) => ele.category === findcategory.name);
  
    if (findArticleByCategory.length === 0)  throw new Error(`articles with ${findcategory.name} not found`);

    findArticleByCategory.sort((a, b) => (a.title > b.title ? 1 : -1));

    if (limit) findArticleByCategory.length = limit;

    res.status(200).json({
      status: "success",
      message: "articles fetched successfully",
      data: findArticleByCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

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

    let findcategory = Categories.findIndex((ele) => ele.id === id);
    if (findcategory === -1) throw new Error("category not found");
    Categories[findcategory] = {
      ...Categories[findcategory],
      ...body,
      updatedAt: new Date(),
    };

    res.status(200).json({
      status: "success",
      message: "category updated successfully",
      data: Categories[findcategory],
    });
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
    let findcategory = Categories.findIndex((ele) => ele.id === id);

    if (findcategory === -1) throw new Error("category not found");
    let articleCategory = Articles.find((ele) => ele.category === Categories[findcategory].name);
    if (articleCategory)
      throw new Error("articles with this category exist, cannot delete category");

    Categories.splice(findcategory, 1);

    res.status(200).json({
      status: "success",
      message: "category removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});
