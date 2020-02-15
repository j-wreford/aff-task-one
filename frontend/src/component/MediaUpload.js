// react
import React from 'react'

// material ui
import { Typography } from '@material-ui/core'

// application
import PaddedPaper from '../component/hoc/PaddedPaper'

/**
 * Presents an interface to let the logged in user upload a new document
 * to the database.
 */
export default function MediaUpload(props) {
    console.log("Upload media");
    return (
        <React.Fragment>
            <Typography variant="subtitle1" gutterBottom>Upload your media</Typography>
            <PaddedPaper>
                <Typography variant="p">Follow the instructions to upload a new document to the management system.</Typography>
            </PaddedPaper>
        </React.Fragment>
    )
}