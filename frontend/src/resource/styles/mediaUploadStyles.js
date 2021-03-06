"use strict"

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    tagsBox: {
        marginTop: "1em"
    },
    tag: {
        margin: theme.spacing(0.5)
    },
    divider: {
        marginTop: theme.spacing(1.25),
        marginBottom: theme.spacing(1.25),
        backgroundColor: "transparent"
    }
}))