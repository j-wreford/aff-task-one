"use strict";

const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

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
 * Compares the given (unhashed) password to the current one stored
 * within the database.
 */
userAccountSchema.methods.testPassword = async function(password) {
    
    let match = false
    
    try {
        
        match = await bcrypt.compare(password, this.password, false) 
    }
    catch (error) {

        console.log(error)
    }
    
    return match
}

/**
 * Pre hook to hash a password before commiting the new user
 * document to the collection
 */
userAccountSchema.pre("save", function(next) {

    let user = this

    bcrypt.hash(user.password, 10, (error, hash) => {

        if (error) {
            console.log(`Error in hashing password: ${error.message}`)
            next(error)
        }
        else {
            user.password = hash
            next()
        }
    })
})

module.exports = mongoose.model("UserAccount", userAccountSchema);