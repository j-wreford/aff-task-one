// react
import React from 'react'

// material ui
import { Grid, Paper } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

// application
import useStyles from '../resource/styles/mediaViewHeaderStyles'

/**
 * Presents an interface that displays a header containing an alert
 */
export default function MediaViewHeader(props) {

    /**
     * Component styles
     */
    const classes = useStyles()

    return (
        <Grid item xs={12}>
            <Paper elevation={0}>
                <Alert className={classes.alert} variant="outlined" severity={props.severity || "info"}>
                    <AlertTitle>{props.title}</AlertTitle>
                    <Grid container xs={12}>
                        <Grid item xs={12}>
                            {props.children}
                        </Grid>
                    </Grid>
                </Alert>
            </Paper>
        </Grid>
    )
}