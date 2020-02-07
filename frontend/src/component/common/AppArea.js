"use strict"

// react
import React from 'react'
import { Route } from 'react-router-dom'

// material ui
import { Typography } from '@material-ui/core'

// application
import { UserContext } from '../../context/UserContext'
import classes from '../../resource/styles/appAreaStyles'

/**
 * Presents the main container for each one of the applications' views
 * and configures their routes
 */
export default function AppArea(props) {

    /**
     * Information about the currently logged in user
     */
    const userContext = React.useContext(UserContext)

    /**
     * Potentially renders the appropriate routes if the user is
     * logged in.
     * 
     * If the user is not logged in, then the MediaBrowser is rendered
     * with severely limited functionality.
     */
    const maybeRenderRoutes = () => {
        
        let components = (
            <main className={classes.content}>
                {/** @TODO render the media browser, but ONLY public documents */}
                <Typography>Log in you fuck</Typography>
            </main>
        )

        if (userContext) {
            components = (
                <main className={classes.content}>
                    <Route exact path="/upload" component={Typography} />
                    <Route exact path="/browse" component={Typography} />
                    <Route exact path="/chat" component={Typography} />
                </main>
            )
        }

        return components
    }

    return (
        maybeRenderRoutes()
    )
}