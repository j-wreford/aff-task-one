// react
import React from 'react'

// material ui
import { Typography } from '@material-ui/core'
import { withStyles} from '@material-ui/core/styles'

const styles = theme => ({
    formPrompt: {    
        marginTop: "1em",
        fontSize: "1em",
        opacity: 0.6
    }
})

/**
 * A react material ui Higher Order Component that displays typography
 * intended for a prompt below a form
 */
function FormPrompt(props) {
    return (      
        <Typography
            className={props.classes.formPrompt}
            {...props}
        >
            {props.children}
        </Typography>
    )
}

export default withStyles(styles)(FormPrompt);