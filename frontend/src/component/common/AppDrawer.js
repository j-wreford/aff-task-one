"use strict"

// react
import React  from 'react'
import { Link, NavLink, useHistory } from 'react-router-dom'
import clsx from 'clsx'

// material ui
import { Drawer, Typography, Divider, Button, ButtonBase, IconButton, ListItem, ListItemIcon, ListItemText, Fade } from '@material-ui/core'
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, CloudUpload as CloudUploadIcon, PermMedia as PermMediaIcon, ExitToApp as ExitToAppIcon, Chat as ChatIcon, VpnKey } from '@material-ui/icons'

// http status codes
import statusCodes from 'http-status-codes'

// cookies manager
import { useCookies } from 'react-cookie'

// application
import constants from '../../constants'
import { UserContext } from '../../context/UserContext'
import useApi, {endpoints as apiEndpoints} from '../../effects/apiClient'
import useStyles from '../../resource/styles/appDrawerStyles'

/**
 * Presents a shrinkable menu drawer containing links to the application's
 * main views
 */
export default function AppDrawer(props) {

    /**
     * Api call to logout
     */
    const [logout, logoutIsInProgress, logoutResponse] = useApi("post", apiEndpoints.USER_LOGOUT)

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Obverse the API server's session cookie
     */
    const [cookie, setCookie, removeCookie] = useCookies([constants.SID_COOKIE_NAME])

    /**
     * Used to redirect the user upon logging out
     */
    const history = useHistory()

    /**
     * Information about the currently logged in user
     */
    const [user, setUser] = React.useContext(UserContext)

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

    /**
     * Notifies the API that the user wishes to be logged out and
     * explicitly removes the cookie from the browser
     */
    const handleLogoutButtonClick = () => {
        logout()
    }

    /**
     * React to a response from the api when requesting the current user logs out
     */
    React.useEffect(() => {

        if (logoutResponse &&
            logoutResponse.status === statusCodes.OK &&
            logoutResponse.data) {
            removeCookie(constants.SID_COOKIE_NAME)
            setUser(false)
            history.push("/login")
        }
    }, [logoutResponse])

    /**
     * Menu configuration.
     * 
     * Contains an array of groupings of menu items.
     * A divider is rendered between each group.
     */
    const menuItems = [
        [
            {
                type: "link",
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
                type: "link",
                path: "/browse",
                icon: <PermMediaIcon />,
                text: {
                    primary: "Browse",
                    secondary: user ? "Manage documents" : "View documents"
                },
                show: {
                    loggedIn: true,
                    loggedOut: true
                }
            },
            {
                type: "link",
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
                type: "button",
                onClick: handleLogoutButtonClick,
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
                type: "link",
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
                        if (user) {
                            if (!menuItem.show.loggedIn)
                                return false
                        }
                        else {
                            if (!menuItem.show.loggedOut)
                                return false
                        }
                        // render the menu item
                        return (
                            <ButtonBase
                                component={menuItem.type === "link" ? NavLink : Button}
                                onClick={menuItem.onClick}
                                to={menuItem.path}
                            >
                                <ListItem key="upload">
                                    <ListItemIcon className={clsx({
                                        [classes.buttonIcon]: menuItem.type === "button",
                                        [classes.linkIcon]: menuItem.type === "link"
                                    })}>
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
