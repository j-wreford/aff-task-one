"use strict"

/**
 * Socket event controllers
 */
module.exports = {
    join: require("./controller/join"),
    disconnect: require("./controller/disconnect"),
    sendMessage: require("./controller/sendMessage")
}