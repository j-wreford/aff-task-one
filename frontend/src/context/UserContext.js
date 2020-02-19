// react
import React from 'react'

// api call
import axios from 'axios'

// cookie parsing
import { useCookies } from 'react-cookie'

// application
import constants from '../constants'

/**
 * Creates a React context that can be provides information about the currently
 * logged in user, as well as a method to update it.
 */
export const UserContext = React.createContext({
    user: false,
    setUser: () => {}
})

/**
 * Wraps child components inside the .Provider component, which facilitates having
 * a central source of updating and setting the context's value.
 * 
 * Consumers of this provider are given access to both the user object and a method
 * to set it.
 */
export default (props) => {

    /**
     * Used to grab the API server's session cookie
     */
    const [cookies, setCookies] = useCookies([constants.SID_COOKIE_NAME])

    /**
     * State object about the currently logged in user
     */
    const [user, setUser] = React.useState(false)

    /**
     * Solves a discrepancy between session cookies and user obejcts.
     * 
     * If a session cookie is present on the browser, but we have no user object, then
     * request it from the api server.
     */
    React.useEffect(() => {

        if (!user && cookies[constants.SID_COOKIE_NAME]) {

            console.info("UserContext.js: Session cookie present but no user object. Requesting the user object...")

            axios.get("http://127.0.0.1:5000/user/auth", { withCredentials: true })
                .then(reply => {
                    setUser(reply.data.user)
                    console.log("UserContext.js: Refreshed user object.")
                })
                .catch(error => {
                    setUser(false)
                    console.log("UserContext.js: Error while requesting user object.", error)
                })
        }

    }, [user])

    /**
     * Solves a discrepancy between session cookies and user obejcts.
     * 
     * If a user object is present, but there is no session cookie present on the browser,
     * then remove the user object.
     */
    React.useEffect(() => {

        if (user && !cookies[constants.SID_COOKIE_NAME]) {

            console.info("UserContext.js: User object present but no session cookie. Removing user object...")
            setUser(false)
        }
    }, cookies)

    return (
        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    )
}