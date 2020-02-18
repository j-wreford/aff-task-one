"use strict"

// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Paper, Box, OutlinedInput, InputLabel, InputAdornment, FormControl, Button, IconButton, Typography, FormHelperText } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'

// api call
import axios from 'axios'
import statusCodes from 'http-status-codes'

// application
import { UserContext } from '../context/UserContext'
import useApi from '../api-client/apiClient'

/**
 * Presents an interface for users to authenticate themselves and log
 * in to the application
 */
export default function Login(props) {

    /**
     * Information about the currently logged in user
     */
    const [user, setUser] = React.useContext(UserContext)

    /**
     * Used to redirect the user after logging in
     */
    const history = useHistory()

    /**
     * The value of the username text input
     */
    const [username, setUsername] = React.useState("")

    /**
     * The value of the password text input 
     */
    const [password, setPassword] = React.useState("")

    /**
     * Used to altar the password text input type
     */
    const [showPassword, setshowPassword] = React.useState(false)

    /**
     * Offers error flags and helper text for login form controls
     */
    const [validation, setValidation] = React.useState({
        username: {
            error: false,
            helperText: ""
        },
        password: {
            error: false,
            helperText: ""
        },
        prompt: ""
    })

    /**
     * Describes variables used when contacting the api to login
     */
    const [triggerLogin, loginInProgress, loginResponse] = useApi("post", "user/auth")

    /**
     * Redirects the user to the root path if they're already logged in
     */
    React.useEffect(() => {

        if (user)
            history.push("/")
    })

    /**
     * Updates username state and clears any errors on the input
     */
    const handleOnChangeUsername = (event) => {
        setUsername(event.target.value)
        let v = validation
        v.username = {
            error: false,
            helperText: ""
        }
        if (!v.password.error)
            v.prompt = ""
        setValidation(v)
    }

    /**
     * Updates password state and clears any errors on the input
     */
    const handleOnChangePassword = (event) => {
        setPassword(event.target.value)
        let v = validation
        v.password = {
            error: false,
            helperText: ""
        }
        if (!v.username.error)
            v.prompt = ""
        setValidation(v)
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
     * Handle loginRequestReply change.
     * 
     * Depending on the result of the request, this effect will either update
     * component state to reflect authentication errors, or finalise login logic
     * and redirect the user to the main application area.
     */
    React.useEffect(() => {

        if (loginResponse) {

            // successful login!
            if (loginResponse.status == statusCodes.OK) {

                setUser(loginResponse.data)
                history.push("/")
            }

            // there were form errors
            if (loginResponse.status == statusCodes.BAD_REQUEST) {

                let data = loginResponse.data
                let v = validation

                v.username.error = !data.fields.username.valid
                v.username.helperText = data.fields.username.hint
                
                v.password.error = !data.fields.password.valid
                v.password.helperText = data.fields.password.hint

                v.prompt = data.message

                setValidation(v)
            }
        }

    }, [loginResponse])

    /**
     * Submits a login request to authenticate the user
     */
    const handleOnFormSubmit = (event) => {
        event.preventDefault()

        triggerLogin({
            username: username,
            password: password
        })
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
                    <FormControl fullWidth={true} error={validation.username.error} variant="outlined" margin="normal">
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <OutlinedInput
                            label="Username"
                            id="username"
                            type="text"
                            value={username}
                            onChange={handleOnChangeUsername}
                            error={validation.username.error}
                            className="login-input"
                        />
                        <FormHelperText id="username-helper">{validation.username.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth={true} error={validation.password.error} variant="outlined" margin="normal">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            label="Password"
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handleOnChangePassword}
                            error={validation.password.error}
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
                        <FormHelperText id="password-helper">{validation.password.helperText}</FormHelperText>
                    </FormControl>
                    <Box mt={2}>
                        <Button
                            onClick={handleOnFormSubmit}
                            variant="contained"
                            color="primary"
                            disabled={validation.prompt.length > 0 ? true : false}
                        >
                            Login
                        </Button>
                    </Box>
                    <Typography>{validation.prompt}</Typography>
                </form>
            </Box>
        </Paper>
    )
}
