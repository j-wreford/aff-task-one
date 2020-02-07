"use strict"

import React from 'react'

/**
 * Describes data about the currently logged in user
 */
export const UserContext = React.createContext(false)

/**
 * Provides UserContext to child components
 */
const UserContextProvider = (props) => {

    /**
     * Default value for when there's no user currently logged in
     */
    const value = false;

    /**
     * Discovers if a user has logged in and returns the result
     */
    const getUser = () => false

    return (
        <UserContext.Provider value={getUser()}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider