/**
 * Requires
 */
const express = require('express')              // request listener
const http = require('http')                    // http server which will use express as its listener
const cors = require('cors')                    // express middleware to enable cross origin resource sharing
const bodyParser = require('body-parser')       // express middleware to parse request bodies into an object

const routeApi = require('./api/api-router')    // routes request endpoints to api routines

/**
 * Object instantiations
 */
const app = express()                           // the express application itself
const router = express.Router()                 // express request routing
const server = http.createServer(app)           // http server

/**
 * Express middleware
 */
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use('/', router)

/**
 * Application settings
 */
app.set("port", process.env.PORT || 5000)

/**
 * API configuration
 */
routeApi(router)

/**
 * Begin listening for requests
 */
server.listen(
    app.get("port"),
    () => {
        console.log(`Express server running at http://localhost:${app.get("port")}.`)
    }
)
  