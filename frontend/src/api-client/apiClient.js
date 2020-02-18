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
    USER_AUTH: "/user/auth",
    USER_LOGOUT: "/user/logout"
}

/**
 * Exposes a react effect hook to call various api endpoints with ease,
 * and have calling components update their state accordingly regardless
 * of the fact that this is an asynchronous operation
 */
export default (method, endpoint) => {

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
    const [inProgress, setInProgress] = React.useState(true)

    /**
     * Triggers the effect to make a request
     */
    const [triggered, setTriggered] = React.useState(false)

    /**
     * Sets triggered to true and subsequently triggers the effect to execute
     */
    const trigger = (data) => {
        setPostData(data)
        setTriggered(true)
    }

    /**
     * Sends the actual request using our instance of axios
     */
    async function makeRequest() {

        const opts = {
            method: method,
            url: endpoint
        }

        if (method === "post")
            opts.data = postData

        try {

            const reply = await api(opts)
            setResponse(reply)
            setInProgress(false)
            setTriggered(false)
        }
        catch (error) {
            
            // TODO handle error.isAxiosError cases
            setResponse(error.response)
            setInProgress(false)
            setTriggered(false)
        }
    }

    /**
     * Executes the api call once triggered mutates
     */
    React.useEffect(() => {

        console.log("About to make request...")

        if (postData && triggered)
            makeRequest()

        return () => {
            //
        };

    }, [triggered])

    return [trigger, inProgress, response]
}