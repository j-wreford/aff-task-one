// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Grid, Paper } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

// application
import SubtleButton from './hoc/SubtleButton'
import useStyles from '../resource/styles/mediaViewRevisionHeaderStyles'

/**
 * Presents an interface that displays a header containing actions for a revision
 * media document.
 */
export default function MediaViewRevisionHeader(props) {

    /**
     * Component styles
     */
    const classes = useStyles()

    /**
     * Browser navigator
     */
    const history = useHistory()

    /**
     * Restores this revision to be the current
     * 
     * @TODO
     */
    const handleRestoreButtonOnClick = event => {
        event.preventDefault()
    }

    /**
     * Redirects the browser to the original media document
     */
    const handleGoBackButtonOnClick = (event) => {
        event.preventDefault()
        history.push("/media/" + props.mediaDocument.forMediaDocument)
    }

    return (
        <Grid item xs={12}>
            <Paper elevation={0}>
                <Alert className={classes.alert} variant="outlined" severity="info">
                    <AlertTitle>Viewing a revision</AlertTitle>
                    <Grid container xs={12}>
                        <Grid item xs={12}>
                            <SubtleButton onClick={handleRestoreButtonOnClick} color="primary">Restore this version</SubtleButton> or <SubtleButton onClick={handleGoBackButtonOnClick} color="primary">go back</SubtleButton>
                        </Grid>
                    </Grid>
                </Alert>
            </Paper>
        </Grid>
    )
}