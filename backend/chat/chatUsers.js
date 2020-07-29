"use strict"

/**
 * A private list of users that are currently chatting
 */
let users = []

/**
 * Export methods used to mutate the users container
 */
module.exports = {

    /**
     * Adds a user to the chat room
     */
    addUser: userObj => {
        
        users.push(userObj)

        return {
            error: false,
            user: userObj
        }
    },

    /**
     * Removes a user from the chat room
     */
    removeUser: userId => {

        const idx = users.findIndex(user => user._id === userId)
        const user = users.splice(idx, 1)[0]

        return user
    },

    /**
     * Returns a user within the chat room that has the given userId
     */
    getUser: userId => {
        return users.find(user => user._id.toString() === userId)
    },

    /**
     * Returns the private users array
     */
    getUsers: () => users
}