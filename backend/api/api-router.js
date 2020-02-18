const controllers = require('./controllers')

/**
 * Routes endpoints to API controllers
 */
const routeApi = (router) => {

    /**
     * ENDPOINT /user/register
     */
    router.route('/user/register')
        .post(controllers.user.register)

    /**
     * ENDPOINT /user/auth
     */
    router.route('/user/auth')
        .post(controllers.user.auth)
        .get(controllers.user.validate)

    /**
     * ENDPOINT /user/logout
     */
    router.route('/user/logout')
        .post(controllers.user.logout)

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
        .delete(controllers.media.deleteOne)
        .put(controllers.media.updateOne)
}

module.exports = routeApi