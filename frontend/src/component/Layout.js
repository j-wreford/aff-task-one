import React, { useState } from 'react';
import {
    makeStyles
} from '@material-ui/core/styles';

import AppTopBar from './common/AppTopBar'
import AppDrawer from './common/AppDrawer'

/**
 * Component styles
 */
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    }
}))

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
    const [drawerOpen, setDrawerOpen] = useState(false)

    /**
     * Opens the drawer.
     * 
     * AppTopBar calls this method through its onDrawerOpen prop.
     */
    const openDrawer = () => {
        setDrawerOpen(true)
    }

    /**
     * Closes the drawer.
     * 
     * AppDrawer calls this method through its onDrawerClose prop.
     */
    const closeDrawer = () => {
        setDrawerOpen(false)
    }

    return (
        <div className={classes.root}>
            <AppTopBar onDrawerOpen={openDrawer} shift={drawerOpen} />
            <AppDrawer onDrawerClose={closeDrawer} open={drawerOpen} />
        </div>
    )
}