/**
 * Routes endpoints to API services
 */
const routeApi = (router) => {

    /**
     * Foobar
     */
    router.route('/').get((request, response) => {
        response.json({
            foo: "bar"
        })
    })
}

module.exports = routeApi