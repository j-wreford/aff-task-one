"use strict"

const chatUsers = require("../chatUsers")

const DEFAULT_ROOM = "default_room"

/**
 * Removes a user from the chat.
 * 
 * @TODO adjust once a user is a real user object
 */
module.exports = function disconnect(userId) {

    const user = chatUsers.removeUser(userId)

    if (!user)
        return

    // inform current chatters that the user has left
    this.io.to(DEFAULT_ROOM).emit("message", {
        user: "system",
        text: `${user.fname} has left the chat.`
    })
    
    // inform the room of the change in users
    this.io.to(DEFAULT_ROOM).emit("room_data", {
        room: DEFAULT_ROOM,
        users: chatUsers.getUsers()
    })
}