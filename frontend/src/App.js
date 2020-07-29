// react
import React, {useState} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

// material ui
import { ThemeProvider } from '@material-ui/styles'
import {Grid, CssBaseline} from '@material-ui/core'

// cookies
import { CookiesProvider } from 'react-cookie'

// application
import Login from './component/Login'
import Layout from './component/Layout'
import Styles from './resource/App.css'
import theme from './resource/theme'
import UserContextProvider from './context/UserContext'


/**
 * Root component for TMS Media Manager
 */
export default function App() {

    return (
        <ThemeProvider theme={theme}>
            <UserContextProvider>
                <CookiesProvider>
                    <Grid id="App">
                        <CssBaseline />
                        <Router>
                            <Switch>
                                <Route exact path="/login" component={Login} />
                                <Route path="/" component={Layout} />
                            </Switch> 
                        </Router>
                    </Grid>
                </CookiesProvider>
            </UserContextProvider>
        </ThemeProvider>
    )
}