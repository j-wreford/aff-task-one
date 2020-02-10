"use strict"

// react
import React  from 'react'
import { Redirect } from 'react-router'
import clsx from 'clsx'

// material ui
import { Drawer, List, Typography, Divider, Button, IconButton, ListItem, ListItemIcon, ListItemText, Fade } from '@material-ui/core'
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, CloudUpload as CloudUploadIcon, PermMedia as PermMediaIcon, ExitToApp as ExitToAppIcon, Chat as ChatIcon } from '@material-ui/icons'
import { useTheme } from '@material-ui/core/styles'

// application
import { UserContext } from '../../context/UserContext'
import useStyles from '../../resource/styles/appDrawerStyles'

/**
 * Presents a shrinkable menu drawer containing links to the application's
 * main views
 */
export default function AppDrawer(props) {

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Information about the currently logged in user
     */
    const userContext = React.useContext(UserContext)

    /**
     * Application theme
     */
    const theme = useTheme()

    /**
     * Dictates weather or not the drawer is open, and controls the
     * icon that's shown to toggle this state
     */
    const [open, setOpen] = React.useState(false)

    /**
     * When redirect.do is true, a Redirect component will be rendered,
     * allowing the router to switch to another view. The path used will
     * be redirect.to.
     */
    const [redirect, setRedirect] = React.useState({
        do: false,
        to: ""
    })

    /**
     * Renders the appropriate icons given the UserContext
     */
    const renderDrawerList = () => {

        const loggedOut = (
            <React.Fragment>
                <ListItem button key="browse">
                    <ListItemIcon className={classes.icon}>
                        <PermMediaIcon />
                    </ListItemIcon>
                    <ListItemText primary="Browse" secondary="View public files"/>
                </ListItem>
            </React.Fragment>
        )

        const loggedIn = (
            <React.Fragment>
                <ListItem button key="upload">
                    <ListItemIcon className={classes.icon}>
                        <CloudUploadIcon />
                    </ListItemIcon>
                    <ListItemText primary="Upload" secondary="Create a document"/>
                </ListItem>
                <ListItem button key="browse">
                    <ListItemIcon className={classes.icon}>
                        <PermMediaIcon />
                    </ListItemIcon>
                    <ListItemText primary="Browse" secondary="Manage documents"/>
                </ListItem>
                <ListItem button key="chat">
                    <ListItemIcon className={classes.icon}>
                        <ChatIcon />
                    </ListItemIcon>
                    <ListItemText primary="Chat" secondary="Say hello"/>
                </ListItem>
            </React.Fragment>
        )

        return userContext ? loggedIn : loggedOut
    }

    /**
     * Renders logged-in specific icons
     */
    const renderDrawerListLogout = () => {

        const loggedOut = (
            <React.Fragment>
                <Divider />
                <Fade in={open}>
                    <Typography align="center" className={classes.loggedOutDrawerText}>
                        <Button>Log in</Button> to do more
                    </Typography>
                </Fade>
            </React.Fragment>
        )
        
        const loggedIn = (
            <React.Fragment>
                <Divider />
                <List>
                    <ListItem button key="logout" onClick={handleLogoutClick}>
                        <ListItemIcon className={classes.icon}>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout"/>
                    </ListItem>
                </List>
            </React.Fragment>
        )

        return userContext ? loggedIn : loggedOut
    }

    /**
     * Informs the parent component that the close drawer button
     * was just clicked
     */
    const handleToggleButtonClick = () => {
        setOpen(!open)
    }

    /**
     * Triggers a redirect
     * 
     * @TODO Involve session ending etc
     */
    const handleLogoutClick = () => {
        setRedirect({
            do: true,
            to: "/login"
        })
    }

    if (redirect.do)
        return <Redirect push to={redirect.to} />
    
    return (
        <Drawer
            elevation={3}
            variant="permanent"
            className={clsx(
                classes.drawer,
                {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                }
            )}
            classes={{
                paper: clsx(classes.drawerPaper, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                })
            }}
        >
            <div className={classes.toolbar}>
                <Fade in={open}>
                    <Typography className={classes.drawerTitle} variant="h6">
                        Menu
                    </Typography>
                </Fade>
                <div className={classes.drawerTitleSpacing}></div>
                <IconButton onClick={handleToggleButtonClick}>
                    {open ? <ChevronLeftIcon className={classes.drawerToolbarIcon} /> : <MenuIcon className={classes.drawerToolbarIcon} />}
                </IconButton>
            </div>
            {renderDrawerList()}
            {renderDrawerListLogout()}
        </Drawer>
    )
}
