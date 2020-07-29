"use strict"

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        width: "100%"
    },
    content: {
        justifyContent: 'flexStart',
        flexGrow: 1,
        padding: theme.spacing(3),
    }
}))