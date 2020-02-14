"use strict"

// react
import React  from 'react'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'

// material ui
import { Drawer, Typography, Divider, ButtonBase, IconButton, ListItem, ListItemIcon, ListItemText, Fade } from '@material-ui/core'
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, CloudUpload as CloudUploadIcon, PermMedia as PermMediaIcon, ExitToApp as ExitToAppIcon, Chat as ChatIcon, VpnKey } from '@material-ui/icons'

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
     * Menu configuration.
     * 
     * Contains an array of groupings of menu items.
     * A divider is rendered between each group.
     */
    const menuItems = [
        [
            {
                path: "/upload",
                icon: <CloudUploadIcon />,
                text: {
                    primary: "Upload",
                    secondary: "Create a document"
                },
                show: {
                    loggedIn: true,
                    loggedOut: false
                }
            },
            {
                path: "/browse",
                icon: <PermMediaIcon />,
                text: {
                    primary: "Browse",
                    secondary: "View documents"
                },
                show: {
                    loggedIn: true,
                    loggedOut: true
                }
            },
            {
                path: "/chat",
                icon: <ChatIcon />,
                text: {
                    primary: "Chat",
                    secondary: "Say hello"
                },
                show: {
                    loggedIn: true,
                    loggedOut: false
                }
            }
        ],
        [
            {
                path: "/login",
                icon: <ExitToAppIcon />,
                text: {
                    primary: "Logout"
                },
                show: {
                    loggedIn: true,
                    loggedOut: false
                }
            },
            {
                path: "/login",
                icon: <VpnKey />,
                text: {
                    primary: "Login"
                },
                show: {
                    loggedIn: false,
                    loggedOut: true
                }
            }
        ]
    ]

    /**
     * Dictates weather or not the drawer is open, and controls the
     * icon that's shown to toggle this state
     */
    const [open, setOpen] = React.useState(false)

    /**
     * Informs the parent component that the close drawer button
     * was just clicked
     */
    const handleToggleButtonClick = () => {
        setOpen(!open)
    }
    
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
            {menuItems.map(menuItemGroup => (
                <React.Fragment>
                    {menuItemGroup.map(menuItem => {
                        // prevent menu items from showing when they shouldn't
                        if (userContext) {
                            if (!menuItem.show.loggedIn)
                                return false
                        }
                        else {
                            if (!menuItem.show.loggedOut)
                                return false
                        }
                        // render the menu item
                        return (
                            <ButtonBase component={NavLink} to={menuItem.path}>
                                <ListItem key="upload">
                                    <ListItemIcon className={classes.icon}>
                                        {menuItem.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={menuItem.text.primary} secondary={menuItem.text.secondary}/>
                                </ListItem>
                            </ButtonBase>
                        )
                    })}
                    <Divider />
                </React.Fragment>
            ))}
        </Drawer>
    )
}
