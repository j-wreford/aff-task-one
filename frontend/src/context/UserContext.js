"use strict"

// react
import React from 'react'

/**
 * Creates a React context that can be provided / used to pass
 * data about the currently logged in user
 */
export const UserContext = React.createContext(false)

/**
 * Wraps child components inside the .Provider component, which
 * facilitates having a central source of updating and setting
 * the context's value
 */
export default (props) => {

    /**
     * Default value for when there's no user currently logged in
     */
    const value = false;

    /**
     * Discovers if a user has logged in and returns the result
     */
    const getUser = () => value

    return (
        <UserContext.Provider value={getUser()}>
            {props.children}
        </UserContext.Provider>
    )
}