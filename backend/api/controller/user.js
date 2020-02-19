"use strict"

const statusCodes = require('http-status-codes')
const models = require('../../database/models')
const responseFactory = require('../responseFactory')

/**
 * Exposes methods to authenticate and register users
 */
const userController = {

    /**
     * Attempts to authenticate a user with the given account
     * information.
     * 
     * If authentication is successful, then the session is updated with
     * authenticated user object and the session id is returned.
     * 
     * Required data:
     *  - username: the username of the account to authenticate
     *  - password: the password to unlock the account with the given username
     */
    auth: async (request, response) => {   

        let reply = responseFactory.createPostResponse(["username", "password"])

        // attempt to authenticate with the supplied parameters
        try {

            let user = await models.UserAccount.findOne({ username: request.body.username })

            // if user was null, then the user didn't provide a username that exists
            // within the database. send a reply and bail
            if (!user && request.body.username) {

                reply.fields.username.valid = false
                reply.fields.username.hint = `No account found with username ${request.body.username}`
                reply.message = "We couldn't log you in using the given details"

                response.status(statusCodes.BAD_REQUEST)
            }
        
            let match = await user.testPassword(request.body.password)

            // if match isn't true, then the user didn't provide the correct password
            // for the account with the given username
            if (!match && request.body.password) {

                reply.fields.password.valid = false
                reply.fields.password.hint = `Incorrect password`
                reply.message = "We couldn't log you in using the given details"

                response.status(statusCodes.BAD_REQUEST)
            }

            // if user and match are truthy, then we have a successful login
            if (user && match) {

                reply.message = "Successfully logged in"

                let sanitised = {
                    id: user._id,
                    username: user.username,
                    fname: user.fname,
                    lname: user.lname,
                    creationDate: user.creationDate
                }

                reply.user = sanitised

                response.status(statusCodes.OK)

                request.session.user = user
            }
            // else the request was malformed
            else {

                throw Error("Invalid login request")
            }

            response.json(reply)
        }
        catch (error) {

            console.log("AUTH ERROR:", error);

            // handle no given username
            if (!request.body.username) {

                reply.fields.username.valid = false
                reply.fields.username.hint = "Username is a required field"
                reply.message = "Please fill out all required fields before submitting"
            }

            // handle no given password
            if (!request.body.password) {

                reply.fields.password.valid = false
                reply.fields.password.hint = "Password is a required field"
                reply.message = "Please fill out all required fields before submitting"
            }

            if (!request.body.username || !request.body.password)
                response.status(statusCodes.BAD_REQUEST)
            
            response.json(reply)
        }
    },

    /**
     * Valides a client session by providing the user object for that session.
     * 
     * If a successful call to auth hasn't taken place during this session,
     * then an empty object is returned.
     */
    validate: async (request, response) => {

        let reply = responseFactory.createGetResponse("user", false)

        if (request.session && request.session.user) {

            reply.message = "Client is logged in"
            reply.user = request.session.user
        }
        else {

            reply.message = "Client is logged out"
        }

        response.json(reply)
    },

    /**
     * Destroys the session, if one exists with the user object, and explicitly clears
     * the session id cookie
     */
    logout: async (request, response) => {

        let reply = responseFactory.createGetResponse("loggedOut", false)
        
        if (request.session && request.session.user) {

            request.session.destroy()
            response.clearCookie("connect.sid")

            reply.message = "Successfully logged out"
            reply.loggedOut = true
        }
        else {

            reply.message = "Logout failed (client user wasn't logged in)"
            reply.loggedOut = false
        }

        response.status(statusCodes.OK).json(reply)
    },

    /**
     * Saves a new user to the user collection.
     * 
     * response.data is a user object stripped of its password field.
     */
    register: async (request, response) => {

        let reply = responseFactory.createGetResponse("user", false)

        try {

            const user = new models.UserAccount(request.body)
            let saved = await user.save()

            reply.message = "Successfully created your account"

            // NOT WORKING
            if (delete saved.password)
                reply.user = saved

            response.status(statusCodes.OK)
        }
        catch (error) {

            reply.message = "Something went wrong when trying to create your account"
            response.status(statusCodes.INTERNAL_SERVER_ERROR)

            if (error && error.code) {

                // E11000 duplicate key error collection
                if (error.code === 11000) {
                    reply.message = `An account already exists with the username ${request.body.username}`
                    response.status(statusCodes.OK)
                }
            }
        }

        response.json(reply)
    }
}

module.exports = userController