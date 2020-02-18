// react
import React from 'react'

// material ui
import { Grid, Box, Typography, FormControl, InputLabel, FormHelperText, OutlinedInput, Chip, Button } from '@material-ui/core'

// application
import PaddedPaper from '../component/hoc/PaddedPaper'
import useStyles from '../resource/styles/mediaUploadStyles'
import { UserContext } from '../context/UserContext'
import useApi, { endpoints as apiEndpoints } from '../api-client/apiClient'

/**
 * Presents an interface to let the logged in user upload a new document
 * to the database.
 */
export default function MediaUpload(props) {

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Describes variables used when contacting the api to upload
     */
    const [triggerUpload, uploadInProgress, uploadResponse] = useApi("post", apiEndpoints.MEDIA_UPLOAD)

    /**
     * Information about the currently logged in user
     */
    const [user] = React.useContext(UserContext)
    
    /**
     * Form field: Media title
     */
    const [title, setTitle] = React.useState("")

    /**
     * Form field: Media uri
     */
    const [uri, setUri] = React.useState("")

    /**
     * Form field: Media tags
     */
    const [tags, setTags] = React.useState([
        { key: 0, value: "Test tag 1"},
        { key: 1, value: "Test tag 2"},
        { key: 2, value: "Test tag 3"}
    ])

    /**
     * Updates title state
     */
    const handleOnChangeTitle = event => {
        setTitle(event.target.value)
    }

    const handleOnChangeUri = event => {
        setUri(event.target.value)
    }

    /**
     * Pushes a new tag to tags and clears input
     */
    const pushTag = event => {

        if (event.target.value) {

            let t = [...tags]

            t.push({
                key: tags.length,
                value: event.target.value
            })

            setTags(t)
        }
    }

    /**
     * Removes the given tag from the tags array
     */
    const removeTag = tagToRemove => () => {
        setTags(tags => tags.filter(tag => tag.key !== tagToRemove.key))
    }

    /**
     * Pushes a new tag if the enter key was pressed
     */
    const handleOnTagKeypress = event => {

        if (event.key === "Enter") {
            pushTag(event)
            event.target.value = ""
            event.preventDefault()
        }
    }

    /**
     * Sends a request to the api server 
     */
    const handleOnFormSubmit = event => {
        
        triggerUpload({
            title: title,
            uri: uri,
            tags: tags
        })
    }

    /**
     * Handle response from the api after triggering an upload request
     */
    React.useEffect(() => {
        
        debugger

    }, [uploadResponse])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>Upload your media</Typography>
            </Grid>
            <Grid item xs={12}>
                <PaddedPaper>
                    <Typography variant="p">Follow the instructions to upload a new document to the management system.</Typography>
                </PaddedPaper>
            </Grid>
            <Grid item xs={12}>
                <PaddedPaper>
                    <form onSubmit={handleOnFormSubmit}>
                        <FormControl fullWidth={true} error={false} variant="outlined" margin="normal">
                            <InputLabel htmlFor="title">Title</InputLabel>
                            <OutlinedInput
                                label="Title"
                                id="title"
                                type="text"
                                value={title}
                                onChange={handleOnChangeTitle}
                                error={false}
                            />
                            <FormHelperText id="title-helper">The title of the piece of media you're uploading.</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth={true} error={false} variant="outlined" margin="normal">
                            <InputLabel htmlFor="uri">Resource Link</InputLabel>
                            <OutlinedInput
                                label="Resource Link"
                                id="uri"
                                type="text"
                                value={uri}
                                onChange={handleOnChangeUri}
                                error={false}
                            />
                            <FormHelperText id="title-helper">The link to the piece of media you want to upload.</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth={true} error={false} variant="outlined" margin="normal">
                            <InputLabel htmlFor="tag-add">Add a tag</InputLabel>
                            <OutlinedInput
                                label="Add a tag"
                                id="tag-add"
                                type="text"
                                error={false}
                                onChange={() => {}}
                                onKeyPress={handleOnTagKeypress}
                            />
                            <FormHelperText id="tag-add-helper">Press enter to add a tag once you've finished writing. It'll appear below.</FormHelperText>
                            <Box className={classes.tagsBox}>
                                {tags.map(tag => {
                                    return (
                                        <Chip
                                            className={classes.tag}
                                            key={tag.key}
                                            label={tag.value}
                                            onDelete={removeTag(tag)}
                                        />
                                    )
                                })}
                            </Box>
                        </FormControl>
                        <Box mt={3}>
                            <Button
                                onClick={handleOnFormSubmit}
                                variant="contained"
                                color="primary"
                                disabled={uploadInProgress}
                                disableElevation={true}
                            >
                                Upload
                            </Button>
                        </Box>
                    </form>
                </PaddedPaper>
            </Grid>
        </Grid>
    )
}