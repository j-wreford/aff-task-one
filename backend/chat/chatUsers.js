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
     * 
     * @TODO Get the user's real name
     *       If user does not exist, return an error
     */
    addUser: userId => {
        
        users.push(userId)

        return {
            error: false,
            user: userId
        }
    },

    /**
     * Removes a user from the chat room
     * 
     * @TODO Adjust once users[] holds real user objects
     */
    removeUser: userId => {

        const idx = users.findIndex(user => user === userId)
        const user = users.splice(idx, 1)[0]

        return user
    },

    /**
     * Returns a user within the chat room that has the given userId
     * 
     * @TODO Adjust once users[] holds real user objects
     */
    getUser: userId => {
        return users.find(user => user === userId)
    },

    /**
     * Returns the private users array
     */
    getUsers: () => users
}