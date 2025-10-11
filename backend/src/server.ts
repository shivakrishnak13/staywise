const express = require("express");
require("dotenv");

const app = express();


app.listen(8080, () => {
    console.log("server is running")
})