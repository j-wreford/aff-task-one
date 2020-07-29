"use strict"

import { makeStyles, fade } from '@material-ui/core/styles'

const drawerWidth = 240;

export default makeStyles(theme => ({
    menuButton: {
        marginRight: 36
    },
    linkIcon: {
        marginLeft: 8
    },
    buttonIcon: {
        marginLeft: 0,
        "&& + div": {
            textTransform: "none"
        }
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        "&& a": {
            transition: theme.transitions.create('background', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        "&& a.active" : {
            background: "#ececec"
        },
        "&& hr:last-of-type" : {
            display: "none"
        }
    },
    drawerPaper: {
        boxShadow: "1px 0px 0px rgba(0, 0, 0, 0.12)",
        borderRight: "none"
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
        width: theme.spacing(9) + 1
    },
    drawerTitle: {
        paddingLeft: theme.spacing(0)
    },
    drawerTitleSpacing: {
        flexGrow: 1,
    },
    toolbar: {
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(1.75),
        color: "#ffffff",
        background: theme.palette.primary.dark,
        boxShadow: 3,
        boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
        ...theme.mixins.toolbar
    },
    drawerToolbarIcon: {
        color: "#ffffff"
    },
    loggedOutDrawerText: {
        paddingTop: theme.spacing(3),
        color: "#9e9e9e"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    }
}))