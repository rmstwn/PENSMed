// Use .env file
require('dotenv').config()

//Import module, file and set default environment variable value
const express = require('express'),
      compression = require('compression'),
      cookieParser = require('cookie-parser'),
      crypto = require('crypto'),
      cors = require('cors'),
      port = process.env.PORT || 3333,
      app = express(),
      router = require('./router/router'),
      {env_check} = require('./lib')

// Make sure environment variable is defined
env_check(process.env.HOST_URL, 'HOST_URL')
env_check(process.env.MONGO_HOST, 'MONGO_HOST')
env_check(process.env.MONGO_PORT, 'MONGO_PORT')
env_check(process.env.MONGO_DATABASE, 'MONGO_DATABASE')

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect(`
    mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
    )
    .catch(err => {
        console.error(err)
    })

// Parse x-www-form-urlencoded request
app.use(express.urlencoded({extended: true}))
// Set static file path
app.use(express.static(__dirname + '/public/'))
// Parse cookies
app.use(cookieParser(process.env.COOKIES_SECRET || crypto.randomBytes(20).toString('base64')))
// Parse JSON request
app.use(express.json())
// Compress file
app.use(compression())
// Allow cross-origin request
app.use(cors())

// Define service router
router(app)

// Start server
app.listen(port, () => console.log(`Listening to ${port}`))