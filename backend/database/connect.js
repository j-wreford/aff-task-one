const mongoose = require('mongoose')

/**
 * Connects to and returns a mongoose database connection
 */
const connect = (host, port, name) => {

    if (mongoose.connection.readyState)
        return mongoose.connection

    mongoose.connect(
        `mongodb://${host}:${port}/${name}`,
        {
            useNewUrlParser: true
        }
    )

    mongoose.set("useCreateIndex", true);
    mongoose.set('useFindAndModify', false);

    return mongoose.connection
}

module.exports = connect