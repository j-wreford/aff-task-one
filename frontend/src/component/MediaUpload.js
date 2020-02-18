// react
import React from 'react'

// material ui
import { Grid, Box, Typography, FormControl, InputLabel, FormHelperText, OutlinedInput, Chip, Button } from '@material-ui/core'

// http status codes
import statusCodes from 'http-status-codes'

// application
import PaddedPaper from '../component/hoc/PaddedPaper'
import useStyles from '../resource/styles/mediaUploadStyles'
import { UserContext } from '../context/UserContext'
import useApi, { endpoints as apiEndpoints } from '../effects/apiClient'
import useFormPostValidation from '../effects/formPostValidation'

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
     * Presents methods to validate the form
     */
    const [validation, setFieldValidation] = useFormPostValidation(["title", "uri", "tags", "test"])

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
            tags: tags.map(tag => tag.value)
        })
    }

    /**
     * Handle response from the api after triggering an upload request.
     * 
     * Updates form validation.
     */
    React.useEffect(() => {
    
        if (uploadResponse) {

            console.log(uploadResponse)

            // handle validation errors
            if (uploadResponse.status === statusCodes.BAD_REQUEST &&
                uploadResponse.data && uploadResponse.data.fields) {

                for (const [fieldName, fieldValidation] of Object.entries(uploadResponse.data.fields)) {
                    setFieldValidation(fieldName, !fieldValidation.valid, fieldValidation.hint)
                }
            }
        }
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
                        <FormControl fullWidth={true} error={validation.title.error} variant="outlined" margin="normal">
                            <InputLabel htmlFor="title">Title</InputLabel>
                            <OutlinedInput
                                label="Title"
                                id="title"
                                type="text"
                                value={title}
                                onChange={handleOnChangeTitle}
                                error={validation.title.error}
                            />
                            <FormHelperText id="title-helper">{validation.title.helperText}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth={true} error={validation.uri.error} variant="outlined" margin="normal">
                            <InputLabel htmlFor="uri">Resource Link</InputLabel>
                            <OutlinedInput
                                label="Resource Link"
                                id="uri"
                                type="text"
                                value={uri}
                                onChange={handleOnChangeUri}
                                error={validation.uri.error}
                            />
                            <FormHelperText id="title-helper">{validation.uri.helperText}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth={true} error={validation.tags.error} variant="outlined" margin="normal">
                            <InputLabel htmlFor="tag-add">Add a tag</InputLabel>
                            <OutlinedInput
                                label="Add a tag"
                                id="tag-add"
                                type="text"
                                error={false}
                                onChange={() => {}}
                                onKeyPress={handleOnTagKeypress}
                            />
                            <FormHelperText id="tag-add-helper">{validation.tags.helperText}</FormHelperText>
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