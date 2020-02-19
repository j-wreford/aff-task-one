// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Grid, Chip, Typography, Button, Link, IconButton, FormControl, FormControlLabel, InputLabel, FormHelperText, OutlinedInput, TextField } from '@material-ui/core'
import { ArrowBack as ArrowBackIcon, Launch as LaunchIcon, Delete as DeleteIcon } from '@material-ui/icons'

// http status codes
import statusCodes from 'http-status-codes'

// application
import PaddedPaper from './hoc/PaddedPaper'
import SubtleButton from './hoc/SubtleButton'
import { UserContext } from '../context/UserContext'
import useStyles from '../resource/styles/mediaViewLayoutStyles'
import useApi, { endpoints as apiEndpoints } from '../effects/apiClient'
import MediaViewHeader from './MediaViewHeader'
import MediaViewOriginalSidebar from './MediaViewOriginalSiderbar'

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
     * Api call to update this media document, if viewMode is viewModes.EDIT_ORIGINAL
     */
    const [putMediaDocument, putMediaDocumentIsInProgress, putMediaDocumentResponse] = useApi("put", apiEndpoints.MEDIA_ONE)

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
    const [viewMode, setViewMode] = React.useState(props.viewMode || viewModes.VIEW_ORIGINAL)

    /**
     * The media document this layout is rendering.
     * 
     * This may either be an original media document, or a revision media document discriminant.
     */
    const [mediaDocument, setMediaDocument] = React.useState(null)

    /**
     * Form states and change handlers. Only applicable when viewMode is viewModes.EDIT_ORIGINAL
     */
    const form = {
        states: {
            title: React.useState(""),
            description: React.useState(""),
            uri: React.useState("")
        },
        changeHandlers: {
            title: event => {
                const [get, set] = form.states.title
                set(event.target.value)
            },
            description: event => {
                const [get, set] = form.states.description
                set(event.target.value)
            },
            uri: event => {
                const [get, set] = form.states.uri
                set(event.target.value)
            }
        }
    }

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Browser navigator
     */
    const history = useHistory()

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
            response.data.media) {
                console.log(response)
            setMediaDocument(response.data.media)
        }

    }, [getMediaDocumentResponse])

    /**
     * Navigate back to the original media document in response to a change
     * in putMediaDocumentResponse
     */
    React.useEffect(() => {

        if (viewMode !== viewModes.EDIT_ORIGINAL &&
            viewMode !== viewModes.VIEW_REVISION)
            return

        let response = putMediaDocumentResponse

        if (response &&
            response.status === statusCodes.OK &&
            response.data.success) {

                // if we're in edit mode, then the id of the document we want to view 
                // is simply the id of the current media document.
                //
                // if we're in view mode, then the id of the document we want to go back
                // to is the one this revision media document was a revision of.
                let id = viewMode == viewModes.EDIT_ORIGINAL ? 
                    mediaDocument._id : mediaDocument.forMediaDocument

                history.push("/media/" + id)
            }

    }, [putMediaDocumentResponse])

    /**
     * Set mediaDocument on response to a change in getRevisionDocumentResponse
     */
    React.useEffect(() => {

        let response = getRevisionDocumentResponse

        if (response &&
            response.status === statusCodes.OK &&
            response.data.revision)
            setMediaDocument(response.data.revision)

    }, [getRevisionDocumentResponse])

    /**
     * Update form state in response to a change in mediaDocument, if viewMode
     * is viewModes.EDIT_ORIGINAL
     */
    React.useEffect(() => {

        if (mediaDocument) {

            for (const field of ["title", "description", "uri"]) {
                const [get, set] = form.states[field]
                set(mediaDocument[field])
            }
        }
    }, [mediaDocument])

    /**
     * If viewMode is viewModes.VIEW_REVISION, then the current revision
     * is restored
     */
    const handleRestoreButtonOnClick = event => {
        event.preventDefault()

        if (viewMode !== viewModes.VIEW_REVISION)
            return

        // STEP 1)
        // update the original media document
        putMediaDocument(
            {
                title: mediaDocument.title,
                uri: mediaDocument.uri,
                description: mediaDocument.description
            },
            {
                id: mediaDocument.forMediaDocument
            }
        )

        // STEP 2)
        // delete this media document (this revision has been restored, so it
        // doesn't need to be kept)
    }

    /**
     * If viewMode is viewModes.VIEW_REVISION or viewModes.EDIT_ORIGINAL,
     * then directs the browser back to the original media document view
     */
    const handleReturnToOriginalButtonOnClick = (event) => {
        event.preventDefault()

        let path

        switch (viewMode) {

            case viewModes.VIEW_REVISION:
                path = "/media/" + mediaDocument.forMediaDocument
            break

            case viewModes.EDIT_ORIGINAL:
                path = "/media/" + mediaDocument._id 
            break
        }
        
        history.push(path)
    }

    /**
     * If viewMode is viewModes.EDIT_ORIGINAL, then a request is made to the api
     * to update the document based on the contents of mediaDocument
     */
    const handleOnFormSubmit = event => {
        event.preventDefault()

        if (viewMode !== viewModes.EDIT_ORIGINAL)
            return

        putMediaDocument(
            {
                title: form.states.title[0],
                uri: form.states.uri[0],
                description: form.states.description[0]
            },
            {
                id: mediaDocument._id
            }
        )
    }

    /**
     * Returns the the header to be used if viewMode is viewModes.EDIT_ORIGINAL
     */
    const renderViewModeEditHeader = () => {

        if (viewMode === viewModes.EDIT_ORIGINAL)
            return (
                <MediaViewHeader title="Editing a document" severity="info">
                    <SubtleButton onClick={handleOnFormSubmit} color="primary">Save changes</SubtleButton>
                        or
                    <SubtleButton onClick={handleReturnToOriginalButtonOnClick} color="primary">cancel</SubtleButton>
                </MediaViewHeader>
            )
    }

    /**
     * Returns the the header to be used if viewMode is viewModes.VIEW_REVISION
     */
    const renderViewModeRevisionHeader = () => {

        if (viewMode === viewModes.VIEW_REVISION)
            return (
                <MediaViewHeader title="Viewing a revision" severity="info">
                    <SubtleButton onClick={handleRestoreButtonOnClick} color="primary">Restore this version</SubtleButton>
                        or
                    <SubtleButton onClick={handleReturnToOriginalButtonOnClick} color="primary">go back</SubtleButton>
                </MediaViewHeader>
            )
    }

    /**
     * Returns the <MediaViewOriginalSidebar /> component, if viewMode is viewModes.VIEW_ORIGINAL
     */
    const renderViewModeOriginalSidebar = () => {

        if (viewMode === viewModes.VIEW_ORIGINAL && user)
            return <MediaViewOriginalSidebar mediaDocument={mediaDocument} />
    }

    /**
     * Renders the title or an input to edit the title, depending on the viewMode
     */
    const renderTitle = () => {

        let component

        switch (viewMode) {

            case viewModes.VIEW_ORIGINAL:
            case viewModes.VIEW_REVISION:
                component = <Typography variant="h5">{mediaDocument.title}</Typography>
            break

            case viewModes.EDIT_ORIGINAL:
                component = (
                    <FormControl fullWidth={true} error={false} variant="outlined" margin="normal">
                        <InputLabel htmlFor="title">Title</InputLabel>
                        <OutlinedInput
                            label="Title"
                            id="title"
                            type="text"
                            value={form.states.title[0]}
                            onChange={form.changeHandlers.title}
                            error={false}
                        />
                        <FormHelperText id="title-helper"></FormHelperText>
                    </FormControl>
                )
            break
        }

        return component
    }

    /**
     * Renders the description or an input to edit the description, depending on the viewMode
     */
    const renderDescription = () => {

        let component

        switch (viewMode) {

            case viewModes.VIEW_ORIGINAL:
            case viewModes.VIEW_REVISION:
                component = <Typography className={classes.description} variant="p">{mediaDocument.description}</Typography>
            break

            case viewModes.EDIT_ORIGINAL:
                component = (
                    <FormControl fullWidth={true} error={false} variant="outlined" margin="normal">
                        <TextField
                            label="Description"
                            id="description"
                            multiline
                            rows={10}
                            variant="outlined"
                            value={form.states.description[0]}
                            onChange={form.changeHandlers.description}
                            error={false}
                        />
                        <FormHelperText id="description-helper"></FormHelperText>
                    </FormControl>
                )
            break
        }

        return component
    }

    /**
     * Renders the media link or an input to edit the media link, depending on the viewMode
     */
    const renderMediaLink = () => {

        let component

        switch (viewMode) {

            case viewModes.VIEW_ORIGINAL:
            case viewModes.VIEW_REVISION:
                component = <Link href={mediaDocument.uri} color="secondary" rel="noopener" target="_blank">{mediaDocument.uri} <LaunchIcon fontSize="small" className={classes.newTab} /></Link>
            break

            case viewModes.EDIT_ORIGINAL:
                component = (
                    <FormControl fullWidth={true} error={false} variant="outlined" margin="normal">
                        <InputLabel htmlFor="uri">Resource Link</InputLabel>
                        <OutlinedInput
                            label="Resource Link"
                            id="uri"
                            type="text"
                            value={form.states.uri[0]}
                            onChange={form.changeHandlers.uri}
                            error={false}
                        />
                        <FormHelperText id="uri-helper"></FormHelperText>
                    </FormControl>
                )
            break
        }

        return component
    }

    /**
     * Render unauthorised access if we have a response to the request for
     * a media document and the user isn't logged in
     */
    if (getMediaDocumentResponse &&
        getMediaDocumentResponse.status === statusCodes.UNAUTHORIZED)
        return <Typography>You need to login to view this item</Typography>

    // render not found
    if (getMediaDocumentResponse &&
        getMediaDocumentResponse.status === statusCodes.NOT_FOUND)
        return <Typography>This item doesn't exist</Typography>

    // render loading
    if (!mediaDocument)
        return <Typography>Loading...</Typography>

    return (
        <form onSubmit={handleOnFormSubmit}>
            <Grid container spacing={3}>
                {renderViewModeEditHeader()}
                {renderViewModeRevisionHeader()}
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {renderTitle()}
                            <Typography className={classes.uploadedBy} variant="h5">Uploaded by {mediaDocument.author.fname} {mediaDocument.author.lname}</Typography>
                            {mediaDocument.tags.map(tag => {
                                return (
                                    <Chip className={classes.tagChip} variant="outlined" color="secondary" label={tag}/>
                                )
                            })}
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
                                {renderDescription()}
                            </PaddedPaper>
                        </Grid>
                        <Grid item xs={12}>
                            <PaddedPaper>
                                <Typography variant="h6">Media Link</Typography>
                                {renderMediaLink()}
                            </PaddedPaper>
                        </Grid>
                    </Grid>
                </Grid>
                {/* If we're viewing an original media document, render the MediaViewOriginalSidebar */}
                {renderViewModeOriginalSidebar()}
            </Grid>
        </form>
    )
}