"use strict"

const statusCodes = require('http-status-codes')
const models = require('../../database/models')
const responseFactory = require('../responseFactory')

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

        let reply = responseFactory.createGetResponse("media", [])

        try {

            let media = await models.Media.find()

            reply.media = media
            reply.message = "Successfully found your media"

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            //reply.error = error
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

        let reply = responseFactory.createGetResponse("media", {})

        try {

            let media = await models.Media.findById(request.params.id)

            reply.media = media
            reply.message = "Successfully found this piece of media"

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            //reply.error = error
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

        let reply = responseFactory.createGetResponse("upload", {})

        // bail if the client hasn't logged in during their session
        if (!request.session.user) {

            reply.message = "Refused to upload (client not authorised)"

            response.status(statusCodes.UNAUTHORIZED)
            response.json(reply)
        }

        try {

            const media = new models.Media(request.body)

            let upload = await media.save()

            reply.message = "Successfully uploaded your new piece of media"
            reply.upload = upload

            response.status(200).json(reply)
        }
        catch (error) {

            //reply.error = error
            reply.message = "Something went wrong while trying to upload your new piece of media"

            response.status(statusCodes.BAD_REQUEST)

            response.json(reply)
        }
    }
}

module.exports = mediaController