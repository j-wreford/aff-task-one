// react
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

// material ui
import { AppBar, Toolbar, InputBase, Typography, Button } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'

// application
import { UserContext } from '../../context/UserContext'
import useStyles from '../../resource/styles/appTopBarStyles'

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
     * Shows a login button if the user is logged out
     */
    const renderLoginButton = () => {
        if (!userContext)
            return <Button disableElevation variant="contained" color="secondary" component={Link} to="/login">Login</Button>
    }

    return (
        <div id="AppTopBar" className={classes.root}>
            <AppBar
                position="sticky"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.shift || false,
                })}
            >
                <Toolbar>
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
