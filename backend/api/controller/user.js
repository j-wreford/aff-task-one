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
                (user) => {

                    reply.message = "Successfully created your account"
                    reply.data = {}

                    response.status(200).json(reply)
                },

                // failure
                (error) => {

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