// react
import React from 'react'

// api call
import axios from 'axios'

/**
 * Our axios instance to set common defaults when contacting the api
 */
const api = axios.create({
    baseURL: "http://127.0.0.1:5000/",
    withCredentials: true
})

/**
 * Client supported endpoints
 */
export const endpoints = {
    USER: "/user",
    USER_AUTH: "/user/auth",
    USER_LOGOUT: "/user/logout",
    USER_ONE: "/user/:id", // TODO
    MEDIA: "/media",
    MEDIA_ONE: "/media/:id",
    MEDIA_REVISION_ALL: "/media/:id/revisions",
    MEDIA_REVISION_ONE: "/revision/:id"
}

/**
 * Exposes a react effect hook to call various api endpoints with ease,
 * and have calling components update their state accordingly regardless
 * of the fact that this is an asynchronous operation.
 * 
 * Endpoints can have parameters using the :param syntax. They're replaced
 * when the api call is triggered.
 * 
 * Three references are returned when calling this effect. They are:
 *  1) The function to call to trigger the api call
 *  2) A boolean value indicating the progress of the api call
 *  3) The response from the api server. This value can either be a response
 *     object, or -1 (indicating a pre flight-error)
 */
export default (method, rawEndpoint) => {

    /**
     * Endpoint parameter values to replace parameter placeholders within the rawEndpoint
     */
    const [endpointParams, setEndpointParams] = React.useState({})

    /**
     * The data to be posted if this is a post request
     */
    const [postData, setPostData] = React.useState(null)

    /**
     * The data this api call will return
     */
    const [response, setResponse] = React.useState(null)

    /**
     * Set to true once the http request is replied to
     */
    const [inProgress, setInProgress] = React.useState(false)

    /**
     * When flipped to true, makeRequest() is called through a React.useEffect()
     */
    const [triggerFlag, setTriggerFlag] = React.useState(false)

    /**
     * Triggers the api call
     */
    const trigger = (data, params) => {

        // set the post data property if this is a post request  
        if (data && method === "post")
            setPostData(data)

        if (params)
            setEndpointParams(params)

        setTriggerFlag(true)
    }

    /**
     * Sends the actual request using our instance of axios
     */
    async function makeRequest() {

        setInProgress(true)

        // swap placeholders within rawEndpoint with their real values
        let endpoint = rawEndpoint
        if (endpointParams) {
            for (const [paramKey, paramValue] of Object.entries(endpointParams))
                endpoint = endpoint.replace(":" + paramKey, paramValue)
        }

        // build the configuration object for this request
        let opts = {
            method: method,
            url: endpoint
        }

        if (method === "post")
            opts.data = postData

        console.log("apiClient.js: Making an API request. ", endpointParams, opts)

        try {

            const reply = await api(opts)

            console.log("apiClient.js: Request succeeded. ", reply)

            setResponse(reply)
            setTriggerFlag(false)
            setInProgress(false)
        }
        catch (error) {

            // indicates a pre-flight error - with respect to the assignment, this
            // most likely means that the browser's URI is localhost and not 127.0.0.1
            if (!error.response)
                setResponse(-1)
            else
                setResponse(error.response)

            console.log("apiClient.js: Request failed. ", error)

            setTriggerFlag(false)
            setInProgress(false)
        }
    }

    /**
     * Triggers the request to the api
     */
    React.useEffect(() => {

        if (triggerFlag) {

            makeRequest()
        }
    }, [triggerFlag])

    return [trigger, inProgress, response]
}