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
 * Exposes methods to find and manipulate uploaded media
 */
const mediaController = {

    /**
     * Get all media.
     * 
     * response.data is an array of the media collection.
     */
    getAll: async (request, response) => {

        let reply = defaultResponse([])

        try {

            let media = await models.Media.find()

            reply.data = media
            reply.message = "Successfully found your media"

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            reply.error = error
            reply.message = "Something went wrong while trying to find your media"
            
            response.status(statusCodes.INTERNAL_SERVER_ERROR)
            response.json(reply)
        }
    },

    /**
     * Find a single piece of media.
     * 
     * response.data is the document object of the piece of media requested.
     */
    findOne: async (request, response) => {

        let reply = defaultResponse({})

        try {

            let media = await models.Media.findById(request.params.id)

            reply.data = media
            reply.message = "Successfully found this piece of media"

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            reply.error = error
            reply.message = "Something went wrong while trying to find this piece of media"

            if (error.name == "CastError")
                response.status(statusCodes.BAD_REQUEST)
            else
                response.status(statusCodes.NOT_FOUND)

            response.json(reply)
        }
    },

    /**
     * Upload a single piece of media.
     * 
     * response.data is the document object of the just uploaded piece of media.
     */
    upload: async (request, response) => {

        let reply = defaultResponse({})

        try {

            const media = new models.Media(request.body)

            let upload = await media.save()

            reply.message = "Successfully uploaded your new piece of media"
            reply.data = upload

            response.status(200).json(reply)
        }
        catch (error) {

            reply.error = error
            reply.message = "Something went wrong while trying to upload your new piece of media"

            response.status(statusCodes.BAD_REQUEST)

            response.json(reply)
        }
    }
}

module.exports = mediaController