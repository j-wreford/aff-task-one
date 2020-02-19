"use strict"

const chatUsers = require("../chatUsers")

const DEFAULT_ROOM = "default_room"

/**
 * Responds to a client event of sending a message, if userId
 * was a valid, registered user identifier.
 * 
 * @TODO adjust once a user is a real user object
 */
module.exports = function sendMessage({userId, message}, callback) {

    const user = chatUsers.getUser(userId)

    if (!user)
        callback()

    // inform the room that a new message has been sent
    this.io.to(DEFAULT_ROOM).emit("message", {
        user: userId,
        text: message
    })
      
    callback()
}