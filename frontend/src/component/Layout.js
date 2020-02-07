"use strict"

// react
import React from 'react'
import {Redirect} from 'react-router'

// react material ui
import { makeStyles } from '@material-ui/core/styles'

// custom components
import AppTopBar from './common/AppTopBar'
import AppDrawer from './common/AppDrawer'

// contexts
import UserContextProvider from '../context/UserContext'

/**
 * Component styles
 */
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    }
}))

/**
 * Presents a general structure for the application once the user
 * has logged in
 */
export default function Layout() {

    /**
     * Theme classes
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
        <div className={classes.root}>
            {console.log(drawerOpen)}
            <UserContextProvider>
                <AppTopBar onDrawerOpen={handleDrawerOpened} shift={drawerOpen} />
            </UserContextProvider>
            <AppDrawer onDrawerClose={handleDrawerClosed} open={drawerOpen} />
        </div>
    )
}