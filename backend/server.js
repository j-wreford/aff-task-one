/**
 * Requires
 */
const express = require('express')              // request listener
const http = require('http')                    // http server which will use express as its listener
const cors = require('cors')                    // express middleware to enable cross origin resource sharing
const bodyParser = require('body-parser')       // express middleware to parse request bodies into an object

const dbConnect = require('./database/connect') // connects to mongodb using mongoose

/**
 * Object instantiations
 */
const routes = express.Router()                 // express request routing
const app = express()                           // the express application itself
const server = http.createServer(app)           // http server
const database = dbConnect(                     // mongoose database connection
    "localhost",
    27017,
    "aff_task_one"
)

/**
 * Express middleware
 */
app.use(cors)
app.use(express.json())
app.use(bodyParser.json())
app.use("", routes)

/**
 * Application settings
 */
app.set("port", process.env.PORT || 5000)

/**
 * Database
 */
database.once("open", () => {
    console.log(`Connected to mongodb running on port ${database.port} (connected to database ${database.name}).`)
})

/**
 * Begin listening for requests
 */
server.listen(
    app.get("port"),
    () => {
        console.log(`Express server running at http://localhost:${app.get("port")}.`)
    }
)
  