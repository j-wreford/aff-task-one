// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Grid, Chip, Typography, Button, Link, IconButton } from '@material-ui/core'
import { ArrowBack as ArrowBackIcon, Launch as LaunchIcon, Delete as DeleteIcon } from '@material-ui/icons'

// http status codes
import statusCodes from 'http-status-codes'

// application
import PaddedPaper from '../component/hoc/PaddedPaper'
import useStyles from '../resource/styles/mediaViewStyles'
import { UserContext } from '../context/UserContext'
import useApi, { endpoints as apiEndpoints } from '../effects/apiClient'

/**
 * Presents an interface that displays the contents of a single media upload.
 */
export default function MediaView(props) {

    /**
     * Contains the URL parameters so we know which media document to get
     */
    const { match: { params } } = props;

    /**
     * Used to redirect the browser
     */
    const history = useHistory()

    /**
     * Information about the currently logged in user
     */
    const [user] = React.useContext(UserContext)

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Api call to get a single piece of media
     */
    const [getMedia, getMediaIsInProgress, getMediaResponse] = useApi("get", apiEndpoints.MEDIA + "/" + params.id)

    /**
     * Api call to get a all reivisions for this piece of media
     */
    const [getRevisions, getRevisionsIsInProgress, getRevisionsResponse] = useApi("get", apiEndpoints.REVISIONS + "/" + params.id)

    /**
     * Api call to remove this piece of media
     */
    const [deleteMedia, deleteMediaIsInProgress, deleteMediaResponse] = useApi("delete", apiEndpoints.MEDIA + "/" + params.id)

    /**
     * The media object being viewed
     */
    const [media, setMedia] = React.useState({})

    /**
     * The list of revisions for the media document being viewed
     */
    const [revisions, setRevisions] = React.useState([])

    /**
     * Returns to the media browser
     */
    const handleBackButtonOnClick = event => {
        history.push("/browse")
    }

    /**
     * Triggers a request to delete this media document.
     * 
     * If this is called client side without being logged in, then the api will
     * refuse to remove it.
     */
    const handleActionDeleteButtonOnClick = event => {
        deleteMedia()
    }

    /**
     * Returns a grid item full of revisions of this media document
     */
    const getMediaRevisionsGridItem = () => {

        if (user && revisions) {
            return (
                <Grid item xs={12}>
                    <PaddedPaper>
                        <Typography variant="h6">History</Typography>
                        <Typography variant="p">View a past version of this media document</Typography>
                        {revisions.map(revision => {
                            return <Typography>{revision.title}</Typography>
                        })}
                    </PaddedPaper>
                </Grid>
            )
        }
    }

    /**
     * Returns a grid item full of actions that can be made on the media document,
     * if the user has been authenticated.
     */
    const getMediaActionsGridItem = () => {

        if (user) {
            return (
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
            )
        }
        else {
            return
        }
    }

    /**
     * Fetch the media document on first mount
     */
    React.useEffect(() => {
        getMedia()
        getRevisions()
    }, [])

    /**
     * React to a response from the api to fetch the piece of media
     */
    React.useEffect(() => {

        if (getMediaResponse) {

            if (getMediaResponse.status && getMediaResponse.status === statusCodes.OK) {
                setMedia(getMediaResponse.data.media)
            }
        }

    }, [getMediaResponse])

    /**
     * React to a response from the api to fetch revisions for this piece of media
     */
    React.useEffect(() => {

        if (getRevisionsResponse) {

            if (getRevisionsResponse.status && getRevisionsResponse.status === statusCodes.OK) {
                setRevisions(getRevisionsResponse.data.revisions)
            }
        }

    }, [getRevisionsResponse])

    /**
     * React to a response from the api to delete this piece of media
     */
    React.useEffect(() => {

        if (deleteMediaResponse) {

            if (getMediaResponse.status && getMediaResponse.status === statusCodes.OK) {
                history.push("/browse")
            }
        }

    }, [deleteMediaResponse])

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={9}>
                            <Typography variant="h5">{media.title}</Typography>
                            {media.author ? (<Typography className={classes.uploadedBy} variant="h5">Uploaded by {media.author.fname} {media.author.lname}</Typography>) : ""}
                            {media.tags ? media.tags.map(tag => {
                                return (
                                    <Chip className={classes.tagChip} variant="outlined" color="secondary" label={tag}/>
                                )
                            }) : undefined}
                        </Grid>
                        <Grid item xs={3} className={classes.toolBar}>        
                            <IconButton onClick={handleBackButtonOnClick}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <PaddedPaper>
                                <Typography variant="h6">Description</Typography>
                                <Typography variant="p">{media.description}</Typography>
                            </PaddedPaper>
                        </Grid>
                        <Grid item xs={12}>
                            <PaddedPaper>
                                <Typography variant="h6">Media Link</Typography>
                                <Link href={media.uri} color="secondary" rel="noopener" target="_blank">{media.uri} <LaunchIcon fontSize="small" className={classes.newTab} /></Link>
                            </PaddedPaper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid container spacing={3}>
                        {getMediaActionsGridItem()}
                        {getMediaRevisionsGridItem()}
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}