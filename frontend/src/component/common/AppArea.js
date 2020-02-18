"use strict"

// react
import React from 'react'
import { Route, Siwtch } from 'react-router-dom'

// material ui
import { Typography, Paper, Switch } from '@material-ui/core'

// application
import MediaUpload from '../MediaUpload'
import { UserContext } from '../../context/UserContext'
import useStyles from '../../resource/styles/appAreaStyles'

/**
 * Presents the main container for each one of the applications' views
 * and configures their routes
 */
export default function AppArea(props) {

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Information about the currently logged in user
     */
    const [user] = React.useContext(UserContext)

    /**
     * Potentially renders the appropriate route if the user is
     * logged in.
     * 
     * If the user is not logged in, then the MediaBrowser is rendered
     * with severely limited functionality.
     */
    const renderRoutes = () => {
        
        let components = (
            <main className={classes.content}>
                {/**
                 * @TODO    If the current path is NOT /browse AND the user
                 *          is not logged in, then render a  <Redirect />
                 *          component with path="/browse".
                 *          This should eleminate the need for conditional
                 *          route rendering below.
                 *          For additional security, each route path below
                 *          can provide an additional safety layer of only
                 *          rendering if the UserContext is not null.
                 *          The media browser component will handle the
                 *          differences between a logged in / logged out 
                 *          state itself.
                */}
                <Typography>You're logged out</Typography>
            </main>
        )

        if (user) {
            components = (
                <main className={classes.content}>
                    <Route path="/upload" component={MediaUpload} />
                    <Route path="/browse" component={Typography} />
                    <Route path="/chat" component={Typography} />
                </main>
            )
        } else {
            components = (
                <main className={classes.content}>
                    <Route path="/browse" component={Typography} />
                </main>
            )
        }

        return components
    }

    return (
        <div id="AppArea" className={classes.root}>
            {props.children}
            {renderRoutes()}
        </div>
    )
}