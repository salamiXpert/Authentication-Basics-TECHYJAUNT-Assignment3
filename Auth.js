const express = require(`express`);
const Auth_app = express();
const morgan = require(`morgan`);
const ConnectDb = require(`./src/Config/db.js`);

require("dotenv").config();
const UserRoute = require(`./src/Routes/Auth.routes.js`);

const port = process.env.PORT || 1500




Auth_app.use(express.json());
Auth_app.use(morgan("dev"));



Auth_app.use(`/api/Users/`, UserRoute);


Auth_app.get(`/`, (req,res) => {
    res.send(`Welcome the world of Authentication in App.`);
})




Auth_app.listen(port,() => {
    ConnectDb();
    console.log(`Authentication_app is running on http://localhost:${port}`);
})