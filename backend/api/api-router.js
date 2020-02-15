const controllers = require('./controllers')

/**
 * Routes endpoints to API controllers
 */
const routeApi = (router) => {

    /**
     * ENDPOINT /media
     */
    router.route('/media')
        .get(controllers.media.getAll)
        .post(controllers.media.upload)

    /**
     * ENDPOINT /media/:id
     */
    router.route('/media/:id')
        .get(controllers.media.findOne)
}

module.exports = routeApi