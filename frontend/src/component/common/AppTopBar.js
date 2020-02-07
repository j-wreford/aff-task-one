import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import {
    fade, makeStyles
} from '@material-ui/core/styles';
import {
    AppBar, Toolbar, InputBase, IconButton, Typography, Button
} from '@material-ui/core'
import {
    Menu as MenuIcon, Search as SearchIcon
} from '@material-ui/icons'

import { UserContext } from '../../context/UserContext'

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
    grow: {
      flexGrow: 1
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block'
      }
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto'
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200
      }
    }
}))

/**
 * Presents a bar showing information about the current view and user
 * actions
 */
export default function AppTopBar(props) {

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Information about the currently logged in user
     */
    const userContext = React.useContext(UserContext)

    /**
     * Informs the parent component that the drawer button
     * was just clicked
     */
    const handleDrawerButtonClick = () => {
        if (typeof props.onDrawerOpen === 'function')
            props.onDrawerOpen()
    }

    /**
     * Shows a login button if the user is logged out
     */
    const renderLoginButton = () => {
        if (!userContext)
            return <Button variant="contained" color="secondary" component={Link} to="/login">Login</Button>
    }

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.shift || false,
                })}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerButtonClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        AFF Assignment
                    </Typography>
                    <div className={classes.grow} />
                    {renderLoginButton()}
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}
