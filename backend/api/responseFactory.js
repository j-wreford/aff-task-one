"use strict"

/**
 * Exposes default reply object factory methods to promote a consistency
 * in reply formats between api endpoints
 */
module.exports =  {

    /**
     * Creates a default post request response object that has
     * valid and hit properties for each given field property
     */
    createPostResponse: fields => {

        let obj = {
            message: "",
            fields: {},
            message: ""
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
     * Creates a default get request response object that
     * has a default data property of the given defaultDataType
     */
    createGetResponse: (dataProp, defaultDataType) => {

        let obj = {}

        obj[dataProp] = defaultDataType
        obj.message = ""

        return obj
    }
}