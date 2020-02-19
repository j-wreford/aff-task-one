// react
import React from 'react'

// application
import useStyles from '../resource/styles/chatMessageStyles'

/**
 * Presents a single chat message
 */
export default function ChatMessage(props) {

    /**
     * Component styles
     */
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={`${classes.text} ${props.variant || "normal"}`}>
                {props.children}
            </div>
            <span className={`${classes.author} ${props.variant || "normal"}`}>{props.author}</span>
        </div>
    )
}