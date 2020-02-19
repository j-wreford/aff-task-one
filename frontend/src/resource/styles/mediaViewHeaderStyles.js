"use strict"

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    alert: {
        paddingTop: theme.spacing(2),
        "& button:first-of-type" : {
            marginLeft: (theme.spacing(1) * -1)
        }
    }
}))