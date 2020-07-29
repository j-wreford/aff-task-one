/**
 * Requires
 */
const express = require('express')                  // request listener
const http = require('http')                        // http server which will use express as its listener
const socketio = require('socket.io')               // powers chat functionality
const cors = require('cors')                        // express middleware to enable cross origin resource sharing
const bodyParser = require('body-parser')           // express middleware to parse request bodies into an object
const session = require('express-session')          // express middleware to store session based data, such as user info
const cookieParser = require('cookie-parser')       // parses cookies bundled with a request

const routeApi = require('./api/api-router')        // routes request endpoints to api routines
const dbConnect = require('./database/connect')     // connects to mongodb using mongoose
const ioControllers = require('./chat/controllers') // socketio socket event controllers

/**
 * Object instantiations
 */
const app = express()                               // the express application itself
const router = express.Router()                     // express request routing
const server = http.createServer(app)               // http server
const io = socketio(server)                         // chat
const database = dbConnect(                         // mongoose database connection
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
    origin: function(origin, callback) {
        // while this allows any origin to accept the returned Set-Cookie
        // header, it still does not prevent localhost from working as expected
        callback(null, true)
    }
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
 * Logs the request domain.
 */
app.use((request, response, next) => {
    //console.log(request)
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
 * Socket configuration
 */
io.on("connection", socket => {

    // controller functions are bound to this property so that they may
    // use these objects within their respective modules
    const bindObj = {
        io, socket
    }

    socket.on("join", ioControllers.join.bind(bindObj))
    socket.on("disconnect", ioControllers.disconnect.bind(bindObj))
    socket.on("send_message", ioControllers.sendMessage.bind(bindObj))
})

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

module.exports = app