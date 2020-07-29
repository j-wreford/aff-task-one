"use strict"

const chatUsers = require("../chatUsers")

const DEFAULT_ROOM = "default_room"

/**
 * Responds to a client event of sending a message, if userId
 * was a valid, registered user identifier.
 */
module.exports = function sendMessage({userId, message}, callback) {

    console.log("User wants to send a message. ", userId, message)
    console.log(chatUsers.getUsers())

    const user = chatUsers.getUser(userId)

    console.log("This user:", user)

    if (!user)
        callback()

    // inform the room that a new message has been sent
    this.io.to(DEFAULT_ROOM).emit("message", {
        user: user,
        text: message
    })
      
    callback()
}