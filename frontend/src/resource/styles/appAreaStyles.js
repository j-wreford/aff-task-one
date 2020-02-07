"use strict"

import { makeStyles } from '@material-ui/core/styles'

const drawerWidth = 240;

export default makeStyles(theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        justifyContent: 'flexStart',
        flexGrow: 1,
        padding: theme.spacing(3),
    }
}))