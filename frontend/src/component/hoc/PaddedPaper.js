// react
import React from 'react'

// material ui
import { Paper } from '@material-ui/core'
import { withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  paperPadding: {    
    padding: '20px',   
  }
})

/**
 * A react material ui Higher Order Component that adjusts the
 * <Paper /> component to have padding on all sides
 */
function PaddedPaper(props) {
  return (      
      <Paper
        elevation={props.elevation}
        className={props.classes.paperPadding}
      >
        {props.children}
      </Paper>
  )
}

export default withStyles(styles)(PaddedPaper);