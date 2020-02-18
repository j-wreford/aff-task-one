"use strict";

const mongoose = require("mongoose");

/**
 * A single media document
 */
const mediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Types.ObjectId,
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
}, { collection: "media" })

module.exports = mongoose.model("Media", mediaSchema);