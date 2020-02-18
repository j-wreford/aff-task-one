/**
 * Requires
 */
const express = require('express')              // request listener
const http = require('http')                    // http server which will use express as its listener
const cors = require('cors')                    // express middleware to enable cross origin resource sharing
const bodyParser = require('body-parser')       // express middleware to parse request bodies into an object
const session = require('express-session')      // express middleware to store session based data, such as user info
const cookieParser = require('cookie-parser')   // parses cookies bundled with a request

const routeApi = require('./api/api-router')    // routes request endpoints to api routines
const dbConnect = require('./database/connect') // connects to mongodb using mongoose

/**
 * Object instantiations
 */
const app = express()                           // the express application itself
const router = express.Router()                 // express request routing
const server = http.createServer(app)           // http server
const database = dbConnect(                     // mongoose database connection
    "localhost",
    27017,
    "aff_task_one"
)

/**
 * Express middleware
 */
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: "hello",
    cookie: {
        maxAge: 4000000,
        httpOnly: false
    },
    resave: false,
    saveUninitialized: false
}))
app.use(cors({
    credentials: true,
    origin: "http://127.0.0.1:3000"
}))

/**
 * Custom middleware.
 * 
 * Removes a stale session id cookie if the a current user isn't found
 * on the session object.
 */
app.use((request, response, next) => {
    if (request.cookies['connect.sid'] &&
        !request.session.user)
        response.clearCookie("connect.sid")
    next()
})

/**
 * Custom middleware.
 * 
 * Logs the user for this session.
 */
app.use((request, response, next) => {
    //console.log(request.session.user)
    next()
})

/**
 * Application settings
 */
app.set("port", process.env.PORT || 5000)

/**
 * API configuration
 */
routeApi(router)
app.use('/', router)

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
  