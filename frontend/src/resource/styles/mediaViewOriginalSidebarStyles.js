"use strict"

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    sectionHeader: {
        margin: `0 ${theme.spacing(2.5)}px`,
        paddingTop: theme.spacing(2.5)
    },
    subtleParagraph: {
        fontStyle: "italic",
        opacity: 0.7
    }
}))