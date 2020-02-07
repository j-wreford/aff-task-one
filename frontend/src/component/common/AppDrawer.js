import React, { useState }  from 'react';
import { Redirect } from 'react-router'
import clsx from 'clsx';
import {
    Drawer, List, Typography, Divider, IconButton,
    ListItem, ListItemIcon, ListItemText
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
    InboxIcon as Icon, Mail as MailIcon, Menu as MenuIcon, Inbox as InboxIcon,
    CloudUpload as CloudUploadIcon, PermMedia as PermMediaIcon,
    ExitToApp as ExitToAppIcon, Chat as ChatIcon
} from '@material-ui/icons'
import {
    makeStyles, useTheme
} from '@material-ui/core/styles';

/**
 * Static width for the drtawer
 */
const drawerWidth = 240;

/**
 * Component styles
 */
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  menuButton: {
    marginRight: 36
  },
  icon: {
      marginLeft: 8
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}))

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
     * Application theme
     */
    const theme = useTheme()

    /**
     * When redirect.do is true, a Redirect component will be rendered,
     * allowing the router to switch to another view. The path used will
     * be redirect.to.
     */
    const [redirect, setRedirect] = useState({
        do: false,
        to: ""
    })

    /**
     * Informs the parent component that the close drawer button
     * was just clicked
     */
    const handleDrawerClose = () => {
        if (typeof props.onDrawerClose === 'function')
            props.onDrawerClose()
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
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: props.open,
                    [classes.drawerClose]: !props.open
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: props.open,
                        [classes.drawerClose]: !props.open
                    })
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
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
                </List>
                <Divider />
                <List>
                    <ListItem button key="logout" onClick={handleLogoutClick}>
                        <ListItemIcon className={classes.icon}>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout"/>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    )
}
