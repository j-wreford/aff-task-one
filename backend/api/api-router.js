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
     * Get all media
     */
    router.route('/media').get((request, response) => {

        let reply = defaultResponse([])
        
        models.media.find((error, media) => {

            if (error) {
                reply.error = error
                reply.message = "Something went wrong while trying to find your media"
            } else {
                reply.data = media
                reply.message = "Successfully found your media"
            }

            response.json(reply)
        })
    })

    /**
     * Find a single piece of media
     */
    router.route('/media/:id').get((request, response) => {

        let reply = defaultResponse({})

        // on the off chance request.params is undefined, wrap this database request inside a
        // try/catch block to prevent an uncaught type error
        try {

            models.media.findById(request.params.id, (error, media) => {
                
                if (error) {
                    reply.error = error
                    reply.message = "Something went wrong while trying to find this piece of media"
                } else {
                    reply.data = media
                    reply.message = "Successfully found this piece of media"
                }

                response.json(reply)
            })

        } catch(error) {

            reply.error = error
            reply.message = "Something went wrong while trying to figure out the id of this piece of media"
            response.json(reply)
        }
    })
}

module.exports = routeApi