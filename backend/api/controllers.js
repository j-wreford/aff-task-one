"use strict"

/**
 * Allows for a single require call and have an object returned
 * containing all of the application's route controllers.
 */
module.exports = {
    user: require('./controller/user'),
    media: require('./controller/media')
}