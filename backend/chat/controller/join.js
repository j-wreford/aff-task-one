"use strict"

const chatUsers = require("../chatUsers")

const DEFAULT_ROOM = "default_room"

/**
 * Adds a user to the chat, if userId was a valid, registered
 * user identifier
 * 
 * @TODO adjust once a user is a real user object
 */
module.exports = function join(userId, callback) {

    const {error, user} = chatUsers.addUser(userId)

    if (error)
        return callback(error)

    // inform the new user that they've connected
    this.socket.emit("message", {
        user: "system",
        text: `Welcome, ${user}.`
    })

    // inform current chatters that a new user has joined
    this.socket.broadcast.to(DEFAULT_ROOM).emit("message", {
        user: "system",
        text: `${user} has entered the chat.`
    })

    // inform the room of the change in users
    this.io.to(DEFAULT_ROOM).emit("room_data", {
        room: DEFAULT_ROOM,
        users: chatUsers.getUsers()
    })

    // join the room
    this.socket.join(DEFAULT_ROOM)
    callback()
}