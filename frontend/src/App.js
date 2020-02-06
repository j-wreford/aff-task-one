import React from 'react';
import Grid from '@material-ui/core/Grid'

import Login from './component/Login'
import './resource/App.css';

function App() {
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      direction="column"
      style={{height: "100vh"}}
    >
      <Grid item sm={12} md={8} lg={3}>
        <Login></Login>
      </Grid>
    </Grid>
  );
}

export default App;
