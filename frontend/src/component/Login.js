import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import FilledInput from '@material-ui/core/FilledInput'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography'

export default class Login extends Component {

    /**
     * Constructor
     */
    constructor() {
        super()

        this.state = {
            username: "",
            password: "",
            showPassword: false
        }

        this.handleOnChangeUsername = this.handleOnChangeUsername.bind(this);
        this.handleOnChangePassword = this.handleOnChangePassword.bind(this);
        this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
        this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
        this.handleOnFormSubmit = this.handleOnFormSubmit.bind(this);
    }

    /**
     * Updates username state
     */
    handleOnChangeUsername(event) {
        this.setState({username: event.target.value})
    }

    /**
     * Updates password state
     */
    handleOnChangePassword(event) {
        this.setState({password: event.target.value})
    }

    /**
     * Toggles password visibility
     */
    handleClickShowPassword() {
        this.setState({showPassword: !this.state.showPassword})
    }

    /**
     * Prevents default behaviour
     */
    handleMouseDownPassword(event) {
        event.preventDefault()
    }

    /**
     * Submits a login request to authenticate the user
     * @TODO
     */
    handleOnFormSubmit(event) {
        event.preventDefault()
    }

    /**
     * Render
     */
    render() {
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
                    <form onSubmit={this.handleOnFormSubmit}>
                        <FormControl fullWidth={true} variant="outlined" margin="normal">
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <OutlinedInput
                                label="Username"
                                id="username"
                                type="text"
                                value={this.state.username}
                                onChange={this.handleOnChangeUsername}
                                className="login-input"
                            />
                        </FormControl>
                        <FormControl fullWidth={true} variant="outlined" margin="normal">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                label="Password"
                                id="password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.password}
                                onChange={this.handleOnChangePassword}
                                className="login-input"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={this.handleClickShowPassword}
                                            onMouseDown={this.handleMouseDownPassword}
                                        >
                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Box mt={2}>
                            <Button
                                onClick={this.handleOnFormSubmit}
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
}
