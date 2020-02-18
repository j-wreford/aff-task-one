// react
import React from 'react'

// material ui
import { Card, CardHeader, CardContent, CardActions, Button, IconButton, Typography } from '@material-ui/core'

// http status codes
import statusCodes from 'http-status-codes'

// application
import PaddedPaper from '../component/hoc/PaddedPaper'
import useStyles from '../resource/styles/mediaBrowserStyles'
import useApi, { endpoints as apiEndpoints } from '../effects/apiClient'
import { UserContext } from '../context/UserContext'

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

    return (
        <React.Fragment>
            {media.map(item => {
                console.log(item)
                return (
                    <Card>
                        <CardHeader
                            title={item.title}
                            subheader={"Uploaded by " + " " + item.author.fname + " " + item.author.lname}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Card content text
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button type="primary" variant="outlined">View</Button>
                        </CardActions>
                    </Card>
                )
            })}
        </React.Fragment>
    )
}