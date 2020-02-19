// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Grid, Chip, Typography, Button, Link, IconButton } from '@material-ui/core'
import { ArrowBack as ArrowBackIcon, Launch as LaunchIcon, Delete as DeleteIcon } from '@material-ui/icons'

// http status codes
import statusCodes from 'http-status-codes'

// application
import PaddedPaper from './hoc/PaddedPaper'
import { UserContext } from '../context/UserContext'
import useStyles from '../resource/styles/mediaViewLayoutStyles'
import useApi, { endpoints as apiEndpoints } from '../effects/apiClient'
import MediaViewOriginalSidebar from './MediaViewOriginalSiderbar'
import MediaViewRevisionHeader from './MediaViewRevisionHeader'

/**
 * An enumeration of the allowed view modes of the component
 */
const viewModes = {
    VIEW_ORIGINAL: 0,
    EDIT_ORIGINAL: 1,
    VIEW_REVISION: 2
}
export { viewModes }

/**
 * Presents a layout which is dependant on the viewMode of the component, set through
 * the property viewMode.
 */
export default function MediaViewLayout(props) {

    /**
     * Contains the URL parameters so we know which media document to get
     */
    const { match: { params } } = props

    /**
     * Information about the currently logged in user
     */
    const [user] = React.useContext(UserContext)

    /**
     * Api call to get this media document, if viewMode is viewModes.VIEW_ORIGINAL
     */
    const [getMediaDocument, getMediaDocumentIsInProgress, getMediaDocumentResponse] = useApi("get", apiEndpoints.MEDIA_ONE)

    /**
     * Api call to get this media revision document, if viewMode is viewModes.VIEW_REVISION
     */
    const [getRevisionDocument, getRevisionDocumentIsInProgress, getRevisionDocumentResponse] = useApi("get", apiEndpoints.MEDIA_REVISION_ONE)

    /**
     * Dictates which piece of media we're rendering.
     * 
     * When set to viewModes.VIEW_ORIGINAL, the component will render a <MediaViewOriginalSidebar /> component,
     * which renders components listing actions one can take on a media document (delete, update), and 
     * a history of revisions.
     * 
     * Likewise, when set to viewModes.VIEW_REVISION, the component will render a <MediaViewRevisionHeader /> component,
     * which renders a header containing actions such as restoring the document.
     */
    const viewMode = props.viewMode || viewModes.VIEW_ORIGINAL

    /**
     * The media document this layout is rendering.
     * 
     * This may either be an original media document, or a revision media document discriminant.
     */
    const [mediaDocument, setMediaDocument] = React.useState(null)

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Fetch the appropriate media document on first mount
     */
    React.useEffect(() => {

        switch (viewMode) {

            case viewModes.VIEW_ORIGINAL:
            case viewModes.EDIT_ORIGINAL:
                getMediaDocument(null, {
                    id: params.id
                })
            break

            case viewModes.VIEW_REVISION:
                getRevisionDocument(null, {
                    id: params.id
                })
            break
        }
    }, [])

    /**
     * Set mediaDocument on response to a change in getMediaDocumentResponse
     */
    React.useEffect(() => {

        let response = getMediaDocumentResponse

        if (response &&
            response.status === statusCodes.OK &&
            response.data.media)
            setMediaDocument(response.data.media)

    }, [getMediaDocumentResponse])

    /**
     * Set mediaDocument on response to a change in getMediaRevisionResponse
     */
    React.useEffect(() => {

        let response = getRevisionDocumentResponse

        if (response &&
            response.status === statusCodes.OK &&
            response.data.revision)
            setMediaDocument(response.data.revision)

    }, [getRevisionDocumentResponse])

    /**
     * Returns the <MediaViewRevisionHeader /> component, if viewMode is viewModes.VIEW_REVISION
     */
    const renderViewModeRevisionHeader = () => {

        if (viewMode === viewModes.VIEW_REVISION)
            return <MediaViewRevisionHeader mediaDocument={mediaDocument} />
    }

    /**
     * Returns the <MediaViewOriginalSidebar /> component, if viewMode is viewModes.VIEW_ORIGINAL
     */
    const renderViewModeOriginalSidebar = () => {

        if (viewMode === viewModes.VIEW_ORIGINAL && user)
            return <MediaViewOriginalSidebar mediaDocument={mediaDocument} />
    }

    if (!mediaDocument)
        return <Typography>Loading...</Typography>

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                {/* If we're viewing a revision media document, then render the MediaViewRevisionHeader */}
                {renderViewModeRevisionHeader()}
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5">{mediaDocument.title}</Typography>
                            {mediaDocument.author ? (<Typography className={classes.uploadedBy} variant="h5">Uploaded by {mediaDocument.author.fname} {mediaDocument.author.lname}</Typography>) : ""}
                            {mediaDocument.tags ? mediaDocument.tags.map(tag => {
                                return (
                                    <Chip className={classes.tagChip} variant="outlined" color="secondary" label={tag}/>
                                )
                            }) : undefined}
                        </Grid>
                    </Grid>
                </Grid>
                {/* If we're viewing an original media document, then make space for the sidebar. else,
                    make this grid item cover the full 12 columns */}
                <Grid item xs={viewMode === viewModes.VIEW_ORIGINAL && user ? 9 : 12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <PaddedPaper>
                                <Typography variant="h6">Description</Typography>
                                <Typography variant="p">{mediaDocument.description}</Typography>
                            </PaddedPaper>
                        </Grid>
                        <Grid item xs={12}>
                            <PaddedPaper>
                                <Typography variant="h6">Media Link</Typography>
                                <Link href={mediaDocument.uri} color="secondary" rel="noopener" target="_blank">{mediaDocument.uri} <LaunchIcon fontSize="small" className={classes.newTab} /></Link>
                            </PaddedPaper>
                        </Grid>
                    </Grid>
                </Grid>
                {/* If we're viewing an original media document, render the MediaViewOriginalSidebar */}
                {renderViewModeOriginalSidebar()}
            </Grid>
        </React.Fragment>
    )
}