// react
import React from 'react'
import { useHistory } from 'react-router-dom'

// material ui
import { Box, Grid, Card, Chip, CardHeader, CardContent, CardActions, Button, ButtonBase, IconButton, Typography, Divider, CardActionArea } from '@material-ui/core'

// http status codes
import statusCodes from 'http-status-codes'

// application
import PaddedPaper from '../component/hoc/PaddedPaper'
import useStyles from '../resource/styles/mediaBrowserStyles'
import useApi, { endpoints as apiEndpoints } from '../effects/apiClient'
import { UserContext } from '../context/UserContext'

/**
 * Table header configuartion
 */
const tableHeadCells = [
    { id: "name", numeric: false, disablePadding: false, label: "Document Title" },
    { id: "author", numeric: false, disablePadding: false, label: "Uploaded By" },
    { id: "date", numeric: false, disablePadding: false, label: "Upload Date" }
]

/**
 * Presents an interface to browse all media documents that have been added
 * to the system.
 */
export default function MediaBrowser(props) {

    /**
     * Component classes
     */
    const classes = useStyles()

    /**
     * Used to redirect to /media/:id
     */
    const history = useHistory()

    /**
     * Describes variables used when contacting the api to fetch media
     */
    const [triggerGetMedia, getMediaInProgress, getMediaResponse] = useApi("get", apiEndpoints.MEDIA)

    /**
     * Information about the currently logged in user
     */
    const [user] = React.useContext(UserContext)

    /**
     * The media documents that have been fetched from the api server
     */
    const [media, setMedia] = React.useState([])

    /**
     * Get media upon first mount
     */
    React.useEffect(() => {
        triggerGetMedia()
    }, [])

    /**
     * Process the response from the getMedia request and update the media state
     */
    React.useEffect(() => {

        if (getMediaResponse) {

            // merge the new media objects with what the component currently has
            if (getMediaResponse.status &&
                getMediaResponse.status == statusCodes.OK) {
                setMedia([...media, ...getMediaResponse.data.media])
            }

            //console.log(getMediaResponse)
        }

    }, [getMediaResponse])

    /**
     * Directs the browser to /media/:id
     */
    const handleViewOnClick = media => event => {
        history.push("/media/" + media._id)
    }

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>{user ? "Manage your documents" : "Browse public documents"}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {media.map(item => {
                    return (
                        <Grid item xs={12} md={6} lg={4}>
                            <Card>
                                <CardHeader
                                    className={classes.cardHeader}
                                    title={item.title}
                                    subheader={"Uploaded by " + " " + item.author.fname + " " + item.author.lname}
                                    titleTypographyProps={{variant: "subtitle2"}}
                                    subheaderTypographyProps={{variant: "subtitle1", className: classes.cardSubheader}}
                                />
                                <CardContent className={classes.cardContent}>
                                    {item.tags.map(tag => {
                                        return <Chip size="small" variant="outlined" label={tag} />
                                    })}
                                </CardContent>
                                <Divider />
                                <CardActions className={classes.cardActions}>
                                    <Button size="small" color="primary" variant="contained" disableElevation href={item.uri}>Open document link</Button>
                                    <Button size="small" color="secondary" variant="outlined" onClick={handleViewOnClick(item)}>View</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </React.Fragment>
    )
}