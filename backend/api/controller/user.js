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
     * response.data is an empty object.
     */
    register: (request, response) => {

        let reply = defaultResponse({})

        try {

            const user = new models.UserAccount(request.body)

            user.save().then(

                // success
                user => {

                    reply.message = "Successfully created your account"
                    reply.data = {}

                    response.status(200).json(reply)
                },

                // failure
                error => {

                    reply.error = error
                    reply.message = "Something went wrong while trying to create your account"

                    response.status(400).json(reply)
                }
            )
        } catch(error) {

            reply.error = error
            reply.message = "Something went wrong while trying to create your account"

            response.status(500).json(reply)
        }
    }
}

module.exports = userController