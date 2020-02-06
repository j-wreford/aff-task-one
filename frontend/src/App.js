import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Login from './component/Login'
import Layout from './component/Layout'
import './resource/App.css'

function App() {
  return (
      <Grid
      container
      alignItems="center"
      justify="center"
      direction="column"
      style={{height: "100vh"}}
    >
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
