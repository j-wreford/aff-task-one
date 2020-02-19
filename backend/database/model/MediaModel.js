"use strict";

const mongoose = require("mongoose");

const UserAccount = require('./UserAccoutModel')

/**
 * A single media document
 */
const mediaSchema = new mongoose.Schema(
    {
        __t: {
            type: String,
            required: true,
            default: "Master"
        },
        title: {
            type: String,
            required: true,
        },
        authorId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        author: {
            type: Object,
            default: {
                username: "[deleted]"
            }
        },
        uri: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: false,
            default: new Date()
        },
        tags: {
            type: [String],
            required: false
        },
        description: {
            type: String,
            required: false,
            default: ""
        },
        isPublic: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: "media"
    }
)

/**
 * Pre hook to save the actual user document onto the piece of media
 */
mediaSchema.pre("save", async function(next) {

    let media = this

    try {
        let user = await UserAccount.findById(media.authorId)
        media.author = user
    }
    catch (error) {
        console.log("Couldn't find the user object for a media authorId.")
    }
})

module.exports = mongoose.model("Media", mediaSchema);