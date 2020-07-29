"use strict"

// react
import React from 'react'

// react material ui
import { makeStyles } from '@material-ui/core/styles'

// application
import AppTopBar from './common/AppTopBar'
import AppDrawer from './common/AppDrawer'
import AppArea from './common/AppArea'
import useStyles from '../resource/styles/layoutStyles'

/**
 * Presents a general structure for the application once the user
 * has logged in
 */
export default function Layout() {

    /**
     * Component classes
     */
    const classes = useStyles();

    return (
        <div id="Layout" className={classes.root}>
            <AppDrawer />
            <AppArea>
                <AppTopBar />    
            </AppArea>
        </div>
    )
}