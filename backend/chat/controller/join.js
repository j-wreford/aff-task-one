"use strict"

const models = require("../../database/models")
const chatUsers = require("../chatUsers")

const DEFAULT_ROOM = "default_room"

/**
 * Adds a user to the chat, if userId was a valid, registered
 * user identifier
 */
module.exports = function join(userId, callback) {

    console.log("A user wants to join. " + userId)

    models.UserAccount.findById(userId)
        .then(({_id, fname, lname, username}) => {

            const {error, user} = chatUsers.addUser({
                _id, fname, lname, username
            })

            console.log(user)

            if (error)
                return callback(error)
        
            // inform the new user that they've connected
            this.socket.emit("message", {
                user: "system",
                text: `Welcome, ${user.fname}.`
            })
        
            // inform current chatters that a new user has joined
            this.socket.broadcast.to(DEFAULT_ROOM).emit("message", {
                user: "system",
                text: `${user.fname} has entered the chat.`
            })
        
            // inform the room of the change in users
            this.io.to(DEFAULT_ROOM).emit("room_data", {
                room: DEFAULT_ROOM,
                users: chatUsers.getUsers()
            })
        
            // join the room
            this.socket.join(DEFAULT_ROOM)
            callback()
        })
        .catch(error => {
            console.log("Couldn't join the chat. ", error)
            callback("Couldn't find a user account with that name")
        })
}