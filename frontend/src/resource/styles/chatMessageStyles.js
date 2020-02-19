"use strict"

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        margin: `${theme.spacing(1)}px 0`
    },
    text: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        borderRadius: theme.spacing(2),
        "&.normal": {
            background: "#eaeaea",
            borderBottomLeftRadius: 0
        },
        "&.self": {
            background: "#c7ec9d",
            borderBottomRightRadius: 0
        },
        "&.system": {
            fontStyle: "italic"
        }
    },
    author: {
        marginTop: theme.spacing(0.5),
        opacity: 0.5,
        fontSize: "0.8em",
        "&.normal": {
            float: "left"
        },
        "&.self": {
            float: "right"
        }
    }
}))