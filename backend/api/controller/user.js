"use strict"

const statusCodes = require('http-status-codes')
const models = require('../../database/models')

/**
 * Returns a default object to be used as the template for any response to a request,
 * in order to promote consistency between API routes.
 * 
 * @TODO Move this function to another module
 */
const defaultResponse = (defaultData) => {
    return {
        error: false,
        message: "",
        data: defaultData
    }
}

/**
 * Exposes methods to authenticate and register users
 */
const userController = {

    /**
     * Attempts to authenticate a user with the given account
     * information.
     * 
     * If authentication is successful, then the session is updated with
     * authenticated user object and the session id is returned
     */
    auth: async (request, response) => {   

        let reply = defaultResponse({})

        try {

            let user = await models.UserAccount.findOne({ username: request.body.username })
            let match = await user.testPassword(request.body.password)

            if (match) {

                reply.message = "Authentication successful!"
                reply.data = {
                    sid: request.sessionID
                }
                request.session.user = user

                response.status(statusCodes.OK)
            }
            else {

                reply.message = "Authentication failed"

                response.status(statusCodes.BAD_REQUEST)
            }

            response.json(reply)
        }
        catch (error) {

            console.log("AUTH ERROR:", error);
            
            reply.error = error
            reply.message = "We couldn't log you in. Please make sure your username and password is correct"

            response.status(statusCodes.INTERNAL_SERVER_ERROR)
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

        let reply = {
            message: "",
            user: false
        }

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

        let reply = defaultResponse()
        
        if (request.session && request.session.user) {

            request.session.destroy()
            response.clearCookie("connect.sid")

            reply.message = "Successfully logged out"
        }
        else {

            reply.message = "Logout failed - no user was logged in"
        }

        response.json(reply)
    },

    /**
     * Saves a new user to the user collection.
     * 
     * response.data is a user object stripped of its password field.
     */
    register: async (request, response) => {

        let reply = defaultResponse({})

        try {

            const user = new models.UserAccount(request.body)
            let saved = await user.save()

            reply.message = "Successfully created your account"

            // NOT WORKING
            if (delete saved.password)
                reply.data = saved

            response.status(statusCodes.OK)
        }
        catch (error) {

            reply.error = error
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