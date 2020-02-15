"use strict";

const mongoose = require("mongoose");

/**
 * A user account
 */
const userAccountSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: false,
        default: new Date()
    }
}, { collection: "user" })

/**
 * Pre hook to hash a password before commiting the new user
 * document to the collection
 */
userAccountSchema.pre("save", next => {

    let user = this

    bcrypt.hash(user.password, 10).then(
            
        // sucess
        hash => {
            user.password = hash;
            next()
        },

        // failure
        error => {
            console.log(`Error in hashing password: ${error.message}`)
            next(error)
        }
    )
})

module.exports = mongoose.model("UserAccount", userAccountSchema);