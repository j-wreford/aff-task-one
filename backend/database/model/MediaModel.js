"use strict";

const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    // author here will be changed to reference a User model
    author: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true
    },
    tags: {
        type: [String],
        required: false
    }
})

module.exports = mongoose.model("Media", mediaSchema);