// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Grid, Typography, Button } from '@material-ui/core'
import { Delete as DeleteIcon } from '@material-ui/icons'

// http status codes
import statusCodes from 'http-status-codes'

// date parsing
import moment from 'moment'

// application
import PaddedPaper from './hoc/PaddedPaper'
import SubtleButton from './hoc/SubtleButton'
import useApi, { endpoints as apiEndpoints } from '../effects/apiClient'

/**
 * Presents an interface that displays a sidebar containing actions and revision
 * history for an original media document.
 */
export default function MediaViewOriginalSidebar(props) {

    /**
     * Browser navigator
     */
    const history = useHistory()

    /**
     * Api call to remove this piece of media
     */
    const [deleteMedia, deleteMediaIsInProgress, deleteMediaResponse] = useApi("delete", apiEndpoints.MEDIA_ONE)

    /**
     * Api call to get a all revisions for this piece of media
     */
    const [getRevisions, getRevisionsIsInProgress, getRevisionsResponse] = useApi("get", apiEndpoints.MEDIA_REVISION_ALL)

    /**
     * The list of revisions for the media document being viewed
     */
    const [revisions, setRevisions] = React.useState([])

    /**
     * Fetch all the revisions for this media document on component first mount
     */
    React.useEffect(() => {
        getRevisions(null, {
            id: props.mediaDocument._id
        })
    }, [])

    /**
     * React to a change in response when requesting all the revisions for this media document
     */
    React.useEffect(() => {

        if (getRevisionsResponse) {

            if (getRevisionsResponse.status && getRevisionsResponse.status === statusCodes.OK) {
                setRevisions(getRevisionsResponse.data.revisions)
            }
        }
    }, [getRevisionsResponse])

    /**
     * React to a change in response when requesting we delete this media document
     */
    React.useEffect(() => {

        if (deleteMediaResponse) {

            if (deleteMediaResponse.status && deleteMediaResponse.status === statusCodes.OK) {
                history.push("/browse")
            }
        }
    }, [deleteMediaResponse])

    /**
     * Triggers the api call to delete this media item
     */
    const handleActionDeleteButtonOnClick = event => {
        deleteMedia(null, {
            id: props.mediaDocument._id
        })
    }

    /**
     * Directs the browser to view the given revision media document
     */
    const handleRevisionButtonOnClick = revisionId => event => {
        history.push("/revision/" + revisionId)
    }

    /**
     * Converts a JavaScript Date string to one that is friendly to read
     */
    const dateStringToHumanReadable = dateString => {
        let m = moment(new Date(dateString))
        return m.format("DD-MM-YYYY [at] HH:mm:ss")
    }

    return (
        <Grid item xs={3}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <PaddedPaper>
                        <Typography variant="h6">Actions</Typography>
                        <br />
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteIcon />}
                            disabled={deleteMediaIsInProgress}
                            onClick={handleActionDeleteButtonOnClick}
                        >
                            Delete
                        </Button>
                    </PaddedPaper>
                </Grid>
                <Grid item xs={12}>
                    <PaddedPaper>
                        <Typography variant="h6">Revision History</Typography>
                        {revisions.map((revisionDocument, index) => {
                            return (
                                <SubtleButton onClick={handleRevisionButtonOnClick(revisionDocument._id)}>{index + 1}. {dateStringToHumanReadable(revisionDocument.date)}</SubtleButton>
                            )
                        })}
                    </PaddedPaper>
                </Grid>
            </Grid>
        </Grid>    
    )
}