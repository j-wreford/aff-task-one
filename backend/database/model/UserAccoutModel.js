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
    hashedPassword: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: false,
        default: new Date()
    }
}, { collection: "user" })

module.exports = mongoose.model("UserAccount", userAccountSchema);