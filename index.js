require("dotenv").config();
const Express = require("express");
const app = Express();
const port = process.env.PORT;
const Joi = require("joi");

app.use(Express.json());

app.listen(port, () => {
  console.log(`you are using port ${port}`);
});
