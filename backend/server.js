/**
 * Requires
 */
const express = require('express')          // request listener
const http = require('http')                // http server which will use express as its listener
const cors = require('cors')                // express middleware to enable cross origin resource sharing
const bodyParser = require('body-parser')   // express middleware to parse request bodies into an object

/**
 * Object instantiations
 */
const routes = express.Router()             // express request routing
const app = express()                       // the express application itself
const server = http.createServer(app)       // http server

/**
 * Express middleware
 */
app.use(cors)
app.use(express.json())
app.use(bodyParser.json())
app.use('', routes)

/**
 * Application settings
 */
app.set("port", process.env.PORT || 5000)

/**
 * Begin listening for requests
 */
server.listen(
    app.get("port"),
    () => {
        console.log(`Express server running at http://localhost:${app.get("port")}.`)
    }
)
  