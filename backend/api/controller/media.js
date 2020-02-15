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
 * Exposes methods to find and manipulate uploaded media
 */
const mediaController = {

    /**
     * Get all media.
     * 
     * response.data is an array of the media collection.
     */
    getAll: (request, response) => {

        let reply = defaultResponse([])
            
        models.Media.find().then(
            
            // success
            (media) => {

                reply.data = media
                reply.message = "Successfully found your media"

                response.status(200)
                response.json(reply)
            },

            // failure
            (error) => {

                reply.error = error
                reply.message = "Something went wrong while trying to find your media"
                
                response.status(500)
                response.json(reply)
            }
        )
    },

    /**
     * Find a single piece of media.
     * 
     * response.data is the document object of the piece of media requested.
     */
    findOne: (request, response) => {

        let reply = defaultResponse({})

        // on the off chance request.params is undefined, wrap this database request inside a
        // try/catch block to prevent an uncaught type error
        try {

            models.Media.findById(request.params.id).then(

                // success
                (media) => {

                    reply.data = media
                    reply.message = "Successfully found this piece of media"

                    response.status(200)
                    response.json(reply)
                },

                // failure
                (error) => {

                    reply.error = error
                    reply.message = "Something went wrong while trying to find this piece of media"

                    if (error.name == "CastError")
                        response.status(400)
                    else
                        response.status(404)

                    response.json(reply)
                }
            )
        } catch(error) {

            reply.error = error
            reply.message = "Something went wrong while trying to figure out the id of this piece of media"

            response.status(500).json(reply)
        }
    },

    /**
     * Upload a single piece of media.
     * 
     * response.data is the document object of the just uploaded piece of media.
     */
    upload: (request, response) => {

        let reply = defaultResponse({})

        try {

            const media = new models.Media(request.body)

            media.save().then(

                // success
                (media) => {

                    reply.message = "Successfully uploaded your new piece of media"
                    reply.data = media

                    response.status(200).json(reply)
                },

                // failure
                (error) => {

                    reply.error = error
                    reply.message = "Something went wrong while trying to upload your new piece of media"

                    response.status(400).json(reply)
                }
            )
        } catch(error) {

            reply.error = error
            reply.message = "Something went wrong while trying to create your new piece of media"

            response.status(500).json(reply)
        }
    }
}

module.exports = mediaController