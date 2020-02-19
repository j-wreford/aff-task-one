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
     * If this session hasn't been authenticated, then only public documents
     * are returned.
     * 
     * This method only returns master documents, and not revised ones.
     * 
     * response.data is an array of the media collection.
     */
    getAll: async (request, response) => {

        let reply = responseFactory.createGetResponse("media", [])

        try {

            let opts = {
                isPublic: true,
                __t: "Master"
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
     * Returns all revisions for the given master media document.
     * 
     * If this session hasn't been authenticated, then the method bails early.
     */
    getAllRevisions: async (request, response) => {

        // bail if the client hasn't logged in during their session
        if (!request.session.user) {

            response
                .status(statusCodes.UNAUTHORIZED)
                .json(responseFactory.createUnauthorizedResponse("Refused to get revisions"))

            return
        }

        let reply = responseFactory.createGetResponse("revisions", [])

        try {

            let revisions = await models.MediaRevision.find({
                forMediaDocument: request.params.id
            })

            reply.revisions = revisions
            reply.message = "Successfully found revisions"

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("REVISIONS ERROR: ", error)

            reply.message = "Something went wrong while trying to find revisions"
            
            response.status(statusCodes.INTERNAL_SERVER_ERROR)
            response.json(reply)
        }
    },

    /**
     * Returns a single revision for the given original media document.
     * 
     * If this session hasn't been authenticated, then the method bails early.
     */
    getOneRevision: async (request, response) => {

        // bail if the client hasn't logged in during their session
        if (!request.session.user) {

            response
                .status(statusCodes.UNAUTHORIZED)
                .json(responseFactory.createUnauthorizedResponse("Refused to get a revision"))

            return
        }

        let reply = responseFactory.createGetResponse("revision", {})

        try {

            let revision = await models.MediaRevision.findById(request.params.id)

            reply.revision = revision
            reply.message = "Successfully found the revision"

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("REVISION ERROR: ", error)

            reply.message = "Something went wrong while trying to find the revision"
            
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

            let opts = {
                _id: request.params.id,
                __t: "Master"
            }

            let media = await models.Media.findOne(opts)

            if (media && !media.isPublic && !request.session.user) {

                response
                    .status(statusCodes.UNAUTHORIZED)
                    .json(responseFactory.createUnauthorizedResponse("Refused to get media"))

                return
            }
            else if (media) {

                reply.media = media
                reply.message = "Successfully found this piece of media"
    
                response.status(statusCodes.OK)
            }
            else {

                reply.media = false
                reply.message = "Couldn't find the piece of media"
    
                response.status(statusCodes.NOT_FOUND)
            }

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
     * Calling this method publishes a MediaRevision document representing
     * the state before the update.
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

            console.log("UPDATING: ", request.params.id, request.body)

            // in order to save a revision, we first have to grab a reference to its current
            // state before we update it (named previous, to reflect the fact this will not
            // have any updated properties).
            //
            // we then construct a new MediaRevision model, and copy over each parameter to the
            // revision model. we then save this revision model, which should always succeed 
            // since the values are validated already from when it was originally saved to the
            // collection
            let previous = await models.Media.findById(request.params.id)

            const revision = new models.MediaRevision({
                title: previous.title,
                date: new Date(),
                authorId: previous.authorId,
                author: previous.author,
                uri: previous.uri,
                tags: previous.tags,
                description: previous.description,
                isPublic: previous.isPublic,
                forMediaDocument: previous._id
            })
            
            // the revision document has been created (but not yet saved), so we can now
            // update the master copy knowing that a revision has been saved
            let update = await models.Media.updateOne({ _id: request.params.id }, request.body)

            // now save the revision - done after the update request incase that fails
            let revisionSave = await revision.save()

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