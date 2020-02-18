"use strict"

// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Grid, Paper, Box, OutlinedInput, InputLabel, InputAdornment, FormControl, Button, IconButton, Typography, FormHelperText } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'

// api call
import axios from 'axios'
import statusCodes from 'http-status-codes'

// application
import SubtleButton from './hoc/SubtleButton'
import FormPrompt from './hoc/FormPrompt'
import { UserContext } from '../context/UserContext'
import useStyles from '../resource/styles/loginStyles'
import useApi, { endpoints as apiEndpoints } from '../effects/apiClient'
import useFormPostValidation from '../effects/formPostValidation'

/**
 * Presents an interface for users to authenticate themselves and log
 * in to the application
 */
export default function Login(props) {

    /**
     * Component classes
     */
    const classes = useStyles()

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
     * Used to alter the password text input type
     */
    const [showPassword, setshowPassword] = React.useState(false)

    /**
     * Describes variables used when contacting the api to login
     */
    const [triggerLogin, loginInProgress, loginResponse] = useApi("post", apiEndpoints.USER_AUTH)

    /**
     * Presents methods to validate the form
     */
    const [validation, setFieldValidation] = useFormPostValidation(["username", "password"])

    /**
     * Prompts the user about how to fix any errors in the form
     */
    const [formPrompt, setFormPrompt] = React.useState("")

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
        setFieldValidation("username", false, "")
        setFormPrompt("")
    }

    /**
     * Updates password state and clears any errors on the input
     */
    const handleOnChangePassword = (event) => {
        setPassword(event.target.value)
        setFieldValidation("password", false, "")
        setFormPrompt("")
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

                setUser(loginResponse.data.user)
                history.push("/")
            }

            // handle validation errors
            if (loginResponse.status === statusCodes.BAD_REQUEST &&
                loginResponse.data && loginResponse.data.fields) {

                for (const [fieldName, fieldValidation] of Object.entries(loginResponse.data.fields)) {
                    setFieldValidation(fieldName, !fieldValidation.valid, fieldValidation.hint)
                }

                if (loginResponse.data.message) {
                    setFormPrompt(loginResponse.data.message)
                }
            }

            // there was a pre-flight network error
            /*
            if (loginResponse === -1) {

                let v = validation
                v.prompt = "Couldn't contact the login server"
                setValidation(v)
            }
            */
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

    /**
     * Directs the user to the register page
     * 
     * @TODO
     */
    const handleRegisterBtnClick = (event) => {
        //
    }

    /**
     * Directs the user to the main application without logging in 
     */
    const handleGuestBtnClick = (event) => {
        history.push("/")
    }

    return (
        <Grid id="Login" className={classes.root}>
            <Paper className={classes.login}>
                <Box p={3}>
                    <Box className={classes.headerBox}>
                        <Typography
                            className={classes.header}
                            paragraph={true}

                        >
                            Login to your TMS account
                        </Typography>
                        <Typography className={classes.subHeader}>
                            or <SubtleButton onClick={handleGuestBtnClick} color="primary" variant="text">continue as a guest</SubtleButton>
                        </Typography>
                    </Box>

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
                                disabled={loginInProgress}
                                disableElevation={true}
                            >
                                Login
                            </Button>
                            <Button
                                className={classes.registerBtn}
                                onClick={handleRegisterBtnClick}
                                variant="outlined"
                                color="primary"
                            >
                                Register
                            </Button>
                        </Box>
                        <FormPrompt>{formPrompt}</FormPrompt>
                    </form>
                </Box>
            </Paper>
        </Grid>
    )
}
