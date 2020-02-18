"use strict"

/**
 * Allows for a single require call and have an object returned
 * containing all of the application's database models.
 */
module.exports = {
    Media: require('./model/MediaModel'),
    UserAccount: require('./model/UserAccoutModel')
}