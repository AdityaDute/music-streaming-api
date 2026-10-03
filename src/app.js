const express = require('express')
const authroutes = require('./routes/auth.route')
const cookieParser = require('cookie-parser')

const app = express();

app.use(express.json())
app.use(cookieParser()) 

app.use("/api/routes", authroutes)


module.exports = app
