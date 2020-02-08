"use strict"

// react
import React from 'react'
import {Redirect} from 'react-router'

// react material ui
import { makeStyles } from '@material-ui/core/styles'

// application
import AppTopBar from './common/AppTopBar'
import AppDrawer from './common/AppDrawer'
import AppArea from './common/AppArea'
import useStyles from '../resource/styles/layoutStyles'

// contexts
import UserContextProvider from '../context/UserContext'

/**
 * Presents a general structure for the application once the user
 * has logged in
 */
export default function Layout() {

    /**
     * Component classes
     */
    const classes = useStyles();

    /**
     * Drawer open state.
     * 
     * Controls the shift state for AppTopBar, and the open state for
     * AppDrawer.
     */
    const [drawerOpen, setDrawerOpen] = React.useState(false)

    /**
     * Opens the drawer.
     * 
     * AppTopBar calls this method through its onDrawerOpen prop.
     */
    const handleDrawerOpened = () => {
        setDrawerOpen(true)
    }

    /**
     * Closes the drawer.
     * 
     * AppDrawer calls this method through its onDrawerClose prop.
     */
    const handleDrawerClosed = () => {
        setDrawerOpen(false)
    }

    return (
        <div id="Layout" className={classes.root}>
            <UserContextProvider>
                <AppDrawer onDrawerClose={handleDrawerClosed} open={drawerOpen} />
                <AppArea>
                    <AppTopBar onDrawerOpen={handleDrawerOpened} shift={drawerOpen} />    
                </AppArea>
            </UserContextProvider>
        </div>
    )
}