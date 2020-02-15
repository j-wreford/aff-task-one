"use strict";

const mongoose = require("mongoose");

/**
 * A user account
 */
const userAccountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        required: false,
        default: new Date()
    }
}, "UserAccount")

module.exports = mongoose.model("UserAccount", userAccountSchema);