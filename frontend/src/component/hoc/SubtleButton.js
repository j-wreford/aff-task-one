// react
import React from 'react'

// material ui
import { Button } from '@material-ui/core'
import { withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  subtleButton: {    
    marginBottom: "0.14em",
    textTransform: "none"
  }
})

/**
 * A react material ui Higher Order Component that adjusts the
 * <Paper /> component to have padding on all sides
 */
function SubtleButton(props) {
    return (      
        <Button
            className={props.classes.subtleButton}
            {...props}
        >
            {props.children}
        </Button>
    )
}

export default withStyles(styles)(SubtleButton);