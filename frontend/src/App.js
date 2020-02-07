import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Grid, CssBaseline} from '@material-ui/core'
import Login from './component/Login'
import Layout from './component/Layout'
import Styles from './resource/App.css'

function App() {

  return (
    <Grid
        container
        alignItems="center"
        justify="center"
        direction="column"
        style={{height: "100vh"}}
    >
        <CssBaseline />
        <Router>
            <Switch>
                <Route exact path="/" component={Layout} />
                <Route exact path="/login" component={Login} />
            </Switch> 
        </Router>
    </Grid>
  )
}

export default App
