"use strict";

const mongoose = require("mongoose")

const MediaModel = require("./MediaModel")

/**
 * A single media history document.
 * 
 * This model describes a media document that represents an old state of the latest
 * media document.
 */
const mediaRevisionSchema = MediaModel.discriminator("Revision", new mongoose.Schema({
    forMediaDocument: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}))

module.exports = mongoose.model("MediaRevision", mediaRevisionSchema);