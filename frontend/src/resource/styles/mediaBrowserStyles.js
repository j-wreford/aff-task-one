"use strict"

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    cardActions: {
        padding: theme.spacing(2)
    },
    cardHeader: {
        paddingBottom: 0
    },
    cardContent: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        "& > .MuiChip-root" : {
            margin: theme.spacing(0.5),
            marginLeft: 0
        }
    },
    cardSubheader: {
        fontSize: "1em",
        opacity: "0.8",
        fontStyle: "italic"
    }
}))