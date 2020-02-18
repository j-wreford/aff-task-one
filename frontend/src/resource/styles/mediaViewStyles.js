"use strict"

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    tagChip: {
        margin: theme.spacing(1.5),
        marginLeft: 0
    },
    toolBar: {
        textAlign: "right"
    },
    newTab: {
        fontSize: "1em",
        marginBottom: "4px"
    },
    uploadedBy: {
        fontSize: "1.2em",
        fontStyle: "italic",
        opacity: 0.6,
        marginTop: theme.spacing(0.5)
    }
}))