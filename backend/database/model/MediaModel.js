"use strict";

const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
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
        type: [String]
    }
})

module.exports = mongoose.model("Media", mediaSchema);