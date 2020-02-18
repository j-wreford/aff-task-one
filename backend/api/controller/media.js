"use strict"

const statusCodes = require('http-status-codes')
const models = require('../../database/models')
const responseFactory = require('../responseFactory')
const userFactory = require('../userFactory')

/**
 * Exposes methods to find and manipulate uploaded media
 */
const mediaController = {

    /**
     * Get all media.
     * 
     * If this session hasn't been authenticated, then only public documents
     * are returned.
     * 
     * response.data is an array of the media collection.
     */
    getAll: async (request, response) => {

        let reply = responseFactory.createGetResponse("media", [])

        try {

            let opts = {
                isPublic: true
            }

            if (request.session.user)
                delete opts.isPublic

            let media = await models.Media.find(opts)

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
     * Delete a single piece of media.
     * 
     * If the client has not been authenticated, then the method bails early.
     */
    deleteOne: async (request, response) => {

        // bail if the client hasn't logged in during their session
        if (!request.session.user) {

            response
                .status(statusCodes.UNAUTHORIZED)
                .json(responseFactory.createUnauthorizedResponse("Refused to delete"))

            return
        }

        let reply = responseFactory.createDeleteResponse()

        try {

            let result = await models.Media.findByIdAndDelete(request.params.id)

            reply.success = true
            reply.message ="Successfully deleted the piece of media"

            response.status(statusCodes.OK).json(reply)
        }
        catch (error) {
        
            reply.success = false
            reply.message = "Something went wrong while trying to delete the piece of media"

            response.status(statusCodes.INTERNAL_SERVER_ERROR).json(reply)
        }
    },

    /**
     * Updates a single piece of media.
     * 
     * If the client has not been authenticated, then the method bails early.
     * 
     * @TODO Calling this method makes a copy of the previous version and adds it to the MediaHistory
     * collection.
     */
    updateOne: async (request, response) => {

        // bail if the client hasn't logged in during their session
        if (!request.session.user) {

            response
                .status(statusCodes.UNAUTHORIZED)
                .json(responseFactory.createUnauthorizedResponse("Refused to update"))

            return
        }

        let reply = responseFactory.createUpdateResponse()

        try {

            models.Media.updateOne({ _id: request.params.id }, request.body)

            reply.success = true
            reply.message ="Successfully updated the piece of media"

            response.status(statusCodes.OK).json(reply)
        }
        catch (error) {

            reply.success = false
            reply.message = "Something went wrong while trying to update the piece of media"

            response.status(statusCodes.INTERNAL_SERVER_ERROR).json(reply)
        }
    },

    /**
     * Upload a single piece of media.
     * 
     * If the client has been authenticated, then the media document is added to the media
     * collection.
     * 
     * Required data:
     *  - title: the title of the piece of media
     *  - uri: a link to the piece of media itself
     *  - tags: an array of strings representing tags to attribute to the piece of media
     * 
     * The newly uploaded piece of media is returned on the reply object with key upload.
     */
    upload: async (request, response) => {

        // bail if the client hasn't logged in during their session
        if (!request.session.user) {

            response
                .status(statusCodes.UNAUTHORIZED)
                .json(responseFactory.createUnauthorizedResponse("Refused to upload"))

            return
        }

        let reply = responseFactory.createPostResponse(["title", "uri", "tags"])

        try {

            const fields = {
                title: request.body.title,
                authorId: request.session.user._id,
                uri: request.body.uri,
                tags: request.body.tags,
                description: request.body.description,
                isPublic: request.body.isPublic
            }

            const media = new models.Media(fields)
            let upload = await media.save()

            // the upload was successful
            reply.message = "Successfully uploaded your new piece of media"
            reply.upload = upload

            response.status(statusCodes.OK).json(reply)
        }
        catch (error) {

            // handle missing or incorrect field values
            if (error.name && error.name === "ValidationError" && error.errors) {

                let errors = error.errors;

                // handle title validation messages
                if (errors.title) {

                    reply.fields.title.valid = false

                    if (errors.title.kind === "required")
                        reply.fields.title.hint = "Title is a required field"

                    reply.message = "We couldn't upload your piece of media. Please make sure you fill out all fields."

                    response.status(statusCodes.BAD_REQUEST)
                }
            
                // handle uri validation messages
                if (errors.uri) {

                    reply.fields.uri.valid = false

                    if (errors.uri.kind === "required")
                        reply.fields.uri.hint = "Link is a required field"

                    reply.message = "We couldn't upload your piece of media. Please make sure you fill out all fields."

                    response.status(statusCodes.BAD_REQUEST)
                }

                // handle tag validation messages
                if (errors.tags) {

                    reply.fields.tags.valid = false

                    if (errors.tags.kind === "Array" &&
                        errors.tags.name === "CastError")
                        reply.fields.tags.hint = "Incorrect data type. Should be an array of strings only"

                    reply.message = "We couldn't upload your piece of media. Please make sure you fill out all fields."

                    response.status(statusCodes.BAD_REQUEST)
                }
            }
            else {

                reply.message = "Something unexpected happened while trying to upload your piece of media"

                response.status(statusCodes.INTERNAL_SERVER_ERROR)
            }

            response.json(reply)
        }
    }
}

module.exports = mediaController