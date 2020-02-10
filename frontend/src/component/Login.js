"use strict"

// react
import React from 'react'

// material ui
import { Paper, Box, OutlinedInput, InputLabel, InputAdornment, FormControl, Button, IconButton, Typography } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'

/**
 * Presents an interface for users to authenticate themselves and log
 * in to the application
 */
export default function Login(props) {

    /**
     * The value of the username text input
     */
    const [username, setUsername] = React.useState("");

    /**
     * The value of the password text input 
     */
    const [password, setPassword] = React.useState("");

    /**
     * Used to altar the password text input
     */
    const [showPassword, setshowPassword] = React.useState(false);

    /**
     * Updates username state
     */
    const handleOnChangeUsername = (event) => {
        setUsername(event.target.value)
    }

    /**
     * Updates password state
     */
    const handleOnChangePassword = (event) => {
        setPassword(event.target.value)
    }

    /**
     * Toggles password visibility
     */
    const handleClickShowPassword = () => {
        setshowPassword(!showPassword)
    }

    /**
     * Prevents default behaviour
     */
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    /**
     * Submits a login request to authenticate the user
     * @TODO
     */
    const handleOnFormSubmit = (event) => {
        event.preventDefault()
    }

    return (
        <Paper>
            <Box p={3}>
                <Typography
                    align="center"
                    paragraph={true}
                    style={{fontWeight: 500}}
                >
                    Please enter your account information
                </Typography>
                <form onSubmit={handleOnFormSubmit}>
                    <FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <OutlinedInput
                            label="Username"
                            id="username"
                            type="text"
                            value={username}
                            onChange={handleOnChangeUsername}
                            className="login-input"
                        />
                    </FormControl>
                    <FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            label="Password"
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handleOnChangePassword}
                            className="login-input"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Box mt={2}>
                        <Button
                            onClick={handleOnFormSubmit}
                            variant="contained"
                            color="primary"
                        >
                            Login
                        </Button>
                    </Box>
                </form>
            </Box>
        </Paper>
    )
}
