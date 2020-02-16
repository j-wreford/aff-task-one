"use strict"

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
     * If authentication passes, then the session is updated with
     * authenticated user object.
     */
    auth: async (request, response) => {

        let reply = defaultResponse({})

        try {

            let user = await models.UserAccount.findOne({ userName: request.body.userName })
            let match = await user.testPassword(request.body.password)

            if (match)
                reply.message = "Authentication successful!"
            else
                reply.message = "Authentication failed"
        }
        catch (error) {

            reply.error = error
            reply.message = "We couldn't log you in. Please make sure your username and password is correct"
        }

        response.json(reply)
    },

    /**
     *  Saves a new user to the user collection.
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

            response.status(200)
        }
        catch (error) {

            reply.error = error
            reply.message = "Something went wrong when trying to create your account"
            response.status(500)

            if (error && error.code) {

                // E11000 duplicate key error collection
                if (error.code === 11000) {
                    reply.message = `An account already exists with the username ${request.body.userName}`
                    response.status(200)
                }
            }
        }

        response.json(reply)
    }
}

module.exports = userController