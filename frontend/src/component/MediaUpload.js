// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Grid, Box, Divider, Typography, FormControl, FormControlLabel, InputLabel, FormHelperText, OutlinedInput, TextField, Chip, Button, Switch } from '@material-ui/core'

// http status codes
import statusCodes from 'http-status-codes'

// application
import PaddedPaper from '../component/hoc/PaddedPaper'
import FormPrompt from './hoc/FormPrompt'
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
     * Browser navigator
     */
    const history = useHistory()

    /**
     * Describes variables used when contacting the api to upload
     */
    const [triggerUpload, uploadInProgress, uploadResponse] = useApi("post", apiEndpoints.MEDIA)

    /**
     * Presents methods to validate the form
     */
    const [validation, setFieldValidation] = useFormPostValidation(["title", "uri", "tags", "description", "public"])

    /**
     * Prompts the user about how to fix any errors in the form
     */
    const [formPrompt, setFormPrompt] = React.useState("")

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
     * Form field: Media description
     */
    const [description, setDescription] = React.useState("")

    /**
     * Form field: Media publicity
     */
    const [isPublic, setIsPublic] = React.useState(false)

    /**
     * Updates title state
     */
    const handleOnChangeTitle = event => {
        setTitle(event.target.value)
    }

    /**
     * Updates uri state
     */
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
     * Toggles isPublic state
     */
    const handleOnPublicSwitchChange = event => {
        setIsPublic(!isPublic)
    }

    /**
     * Updates description state
     */
    const handleOnChangeDescription = event => {
        setDescription(event.target.value)
    }

    /**
     * Sends a request to the api server 
     */
    const handleOnFormSubmit = event => {
        
        triggerUpload({
            title: title,
            uri: uri,
            tags: tags.map(tag => tag.value),
            description: description,
            isPublic: isPublic
        })
    }

    /**
     * Handle response from the api after triggering an upload request.
     * 
     * Updates form validation.
     */
    React.useEffect(() => {

        let response = uploadResponse
    
        if (response) {

            let status = response.status

            // redirect if the upload was valid
            if (status && status === statusCodes.OK &&
                response.data && response.data.upload) {
                history.push("/media/" + response.data.upload._id)
            }

            // handle validation errors
            if (status === statusCodes.BAD_REQUEST &&
                response.data && response.data.fields) {

                for (const [fieldName, fieldValidation] of Object.entries(response.data.fields)) {
                    setFieldValidation(fieldName, !fieldValidation.valid, fieldValidation.hint)
                }

                if (response.data.message) {
                    setFormPrompt(response.data.message)
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
                        <Grid container item xs={12} spacing={3}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2">Enter the title for the piece of media you're uploading.</Typography>
                                <Typography variant="p">This is what will be displayed at the top of the page when viewing this item.</Typography>
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

                                <Divider className={classes.divider} />

                                <Typography variant="subtitle2">Enter the link to the file you're uploading.</Typography>
                                <Typography variant="p">It won't be stored on this server.</Typography>
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

                                <Divider className={classes.divider} />

                                <Typography variant="subtitle2">Choose tags for this document.</Typography>
                                <Typography variant="p">This will help you find it later while browsing your documents.<br/>Type below and press enter to add a new tag and it will appear below.</Typography>
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

                                <Divider className={classes.divider} />

                                <Typography variant="subtitle2">Is this document public?</Typography>
                                <Typography variant="p">When public, a guest will be able to view this document in the document browser.<br/>Don't worry, they won't be able to modify it in any way.</Typography>
                                <FormControl fullWidth={true} error={validation.public.error} variant="outlined" margin="normal">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isPublic}
                                                onChange={handleOnPublicSwitchChange}
                                                value={isPublic}
                                                color="primary"
                                            />
                                        }
                                        label={isPublic ? "Public" : "Private"}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2">Write a description.</Typography>
                                <Typography variant="p">This will be displayed prominantly when viewing it later.</Typography>
                                <FormControl fullWidth={true} error={validation.description.error} variant="outlined" margin="normal">
                                    <TextField
                                        label="Description"
                                        id="description"
                                        multiline
                                        rows={10}
                                        variant="outlined"
                                        value={description}
                                        onChange={handleOnChangeDescription}
                                        error={validation.description.error}
                                    />
                                    <FormHelperText id="title-helper">{validation.description.helperText}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container xs={12}>
                            <Grid item xs={12}>
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
                                <FormPrompt>{formPrompt}</FormPrompt>
                            </Grid>
                        </Grid>
                    </form>
                </PaddedPaper>
            </Grid>
        </Grid>
    )
}