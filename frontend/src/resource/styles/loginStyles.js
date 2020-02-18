"use strict"

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    },
    login: {
        display: "flex",
        maxWidth: "500px"
    },
    headerBox: {
        margin: "1.5em 0 1em 0",
        textAlign: "center"
    },
    header: {
        margin: "0 0 0.5em 0",
        fontWeight: "500"
    },
    registerBtn: {
        marginLeft: theme.spacing(2)
    },
    validationPrompt: {
        marginTop: "1em",
        fontSize: "1em",
        opacity: 0.6
    }
}))