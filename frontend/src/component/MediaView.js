// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Grid, Chip, Typography, IconButton } from '@material-ui/core'
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons'

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
     * Component classes
     */
    const classes = useStyles()

    /**
     * Api call to get a single piece of media
     */
    const [getMedia, getMediaIsInProgress, getMediaResponse] = useApi("get", apiEndpoints.MEDIA + "/" + params.id)

    /**
     * The media object being viewed
     */
    const [media, setMedia] = React.useState({})

    /**
     * Returns to the media browser
     */
    const handleBackButtonOnClick = event => {
        history.push("/browse")
    }

    /**
     * Fetch the media document on first mount
     */
    React.useEffect(() => {
        getMedia()
    }, [])

    React.useEffect(() => {

        if (getMediaResponse) {

            if (getMediaResponse.status && getMediaResponse.status === statusCodes.OK) {
                setMedia(getMediaResponse.data.media)
            }
        }

    }, [getMediaResponse])

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <Typography variant="h5">{media.title}</Typography>
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
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <PaddedPaper>



                    </PaddedPaper>
                </Grid>
                <Grid item xs={4}>
                    <PaddedPaper>Media revision history</PaddedPaper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}