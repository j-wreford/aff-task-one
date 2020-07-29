"use strict"

/**
 * Exposes default reply object factory methods to promote a consistency
 * in reply formats between api endpoints
 */
module.exports =  {

    /**
     * Creates a default post request response object that has valid and hit properties
     * for each given field property
     */
    createPostResponse: fields => {

        let obj = {
            message: "",
            fields: {}
        }
    
        fields.map((field) => {
    
            obj.fields[field] = {
                valid: true,
                hint: ""
            }
        })
    
        return obj
    },

    /**
     * Creates a default get request response object that has a default data property
     * of the given defaultDataType
     */
    createGetResponse: (dataProp, defaultDataType) => {

        let obj = {}

        obj[dataProp] = defaultDataType
        obj.message = ""

        return obj
    },

    /**
     * Creates a default delete request response object that describes the success of
     * the operation and a message to go with it
     */
    createDeleteResponse: () => {

        return {
            success: false,
            message: ""
        }
    },

    /**
     * Creates a default update request response object that describes the success of
     * the operation and a message to go with it
     */
    createUpdateResponse: () => {

        return {
            success: false,
            message: ""
        }
    },

    /**
     * Creates a response object to be sent when the client is attempting
     * to call an endpoint which requires authentication
     */
    createUnauthorizedResponse: (prefix) => {

        prefix = prefix || ""

        return {
            message: prefix + " (Client not authorized)"
        }
    }
}