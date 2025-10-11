const express = require("express");
const dbConnection = require("./configs/db")
require("dotenv").config();

const app = express();
app.use(express.json())

const PORT = process.env.DEFAULT_PORT || 8080;


dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log("server is running")
    })
})