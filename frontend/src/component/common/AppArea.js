"use strict"

// react
import React from 'react'
import { Route, Siwtch } from 'react-router-dom'

// material ui
import { Typography, Paper, Switch } from '@material-ui/core'

// application
import MediaUpload from '../MediaUpload'
import MediaBrowser from '../MediaBrowser'
import MediaViewLayout, { viewModes } from '../MediaViewLayout'
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
        
        let components

        if (user) {
            components = (
                <main className={classes.content}>
                    <Route path="/upload" component={MediaUpload} />
                    <Route exact path="/media/:id" render={props => <MediaViewLayout viewMode={viewModes.VIEW_ORIGINAL} {...props} />} />
                    <Route exact path="/media/:id/edit" render={props => <MediaViewLayout viewMode={viewModes.EDIT_ORIGINAL} {...props} />} />
                    <Route path="/revision/:id" render={props => <MediaViewLayout viewMode={viewModes.VIEW_REVISION} {...props} />} />
                    <Route path="/browse" component={MediaBrowser} />
                    <Route path="/chat" component={Typography} />
                </main>
            )
        } else {
            components = (
                <main className={classes.content}>
                    <Route path="/browse" component={MediaBrowser} />
                    <Route path="/media/:id" render={props => <MediaViewLayout viewMode={viewModes.VIEW_ORIGINAL} {...props} />} />
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