const models = require('../database/models')

/**
 * Returns a default object to be used as the template for any response to a request,
 * in order to promote consistency between API routes
 */
const defaultResponse = (defaultData) => {
    return {
        error: false,
        message: "",
        data: defaultData
    }
}

/**
 * Routes endpoints to API services
 */
const routeApi = (router) => {

    /**
     * ENDPOINT /media
     */
    router.route('/media')
        /**
         * Get all media.
         * 
         * response.data is an array of the media collection
         */
        .get((request, response) => {

            let reply = defaultResponse([])
            
            models.Media.find((error, media) => {

                if (error) {
                    reply.error = error
                    reply.message = "Something went wrong while trying to find your media"
                    response.status(500)
                } else {
                    reply.data = media
                    reply.message = "Successfully found your media"
                    response.status(200)
                }

                response.json(reply)
            })
        })
        /**
         * Upload a single piece of media.
         * 
         * response.data is the document object of the just uploaded piece of media.
         */
        .post((request, response) => {

            let reply = defaultResponse({})
    
            try {
    
                const media = new models.Media(request.body)
    
                media.save()
                    .then((media) => {
    
                        reply.message = "Successfully uploaded your new piece of media"
                        reply.data = media
    
                        response.status(200).json(reply)
                    })
                    .catch((error) => {
    
                        reply.error = error
                        reply.message = "Something went wrong while trying to upload your new piece of media"
    
                        response.status(400).json(reply)
                    })
    
            } catch(error) {
    
                reply.error = error
                reply.message = "Something went wrong while trying to create your new piece of media"
    
                response.status(500).json(reply)
            }
        })

    /**
     * ENDPOINT /media/:id
     * 
     * Find a single piece of media.
     * 
     * response.data is the document object of the piece of media requested.
     */
    router.route('/media/:id').get((request, response) => {

        let reply = defaultResponse({})

        // on the off chance request.params is undefined, wrap this database request inside a
        // try/catch block to prevent an uncaught type error
        try {

            models.Media.findById(request.params.id, (error, media) => {
                
                if (error) {
                    reply.error = error
                    reply.message = "Something went wrong while trying to find this piece of media"

                    if (error.name == "CastError")
                        response.status(400)
                    else
                        response.status(404)

                } else {
                    reply.data = media
                    reply.message = "Successfully found this piece of media"
                    response.status(200)
                }

                response.json(reply)
            })

        } catch(error) {

            reply.error = error
            reply.message = "Something went wrong while trying to figure out the id of this piece of media"
            response.status(500).json(reply)
        }
    })
}

module.exports = routeApi