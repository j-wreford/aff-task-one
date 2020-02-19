// react
import React from 'react'

// material ui
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core'
import { Send as SendIcon } from '@material-ui/icons'

// chat functionality
import io from 'socket.io-client'

/**
 * The socket this user owns and uses to chat with
 */
let socket

/**
 * Presents an interface used to chat to other users
 */
export default function Chat(props) {

    /**
     * The current message the user is typing
     */
    const [message, setMessage] = React.useState("")

    const [incomingMessage, setIncommingMessage] = React.useState("")
    
    /**
     * The chat history containing all messages
     */
    const [messages, setMessages] = React.useState([])

    /**
     * Join the chat and hook up message events upon first component
     * mount
     */
    React.useEffect(() => {

        socket = io("http://127.0.0.1:5000")

        socket.emit("join", "test user id", () => {
            
        })

        socket.on("message", message => {
            setIncommingMessage(message)
        })

        return () => {
            socket.emit("disconnect")
            socket.off()
        }
    }, [])

    /**
     * Adds the incoming message to the messages collection
     */
    React.useEffect(() => {

        setMessages([...messages, incomingMessage])
        
    }, [incomingMessage])

    /**
     * Triggers a send message socket event
     */
    const sendMessage = event => {
        event.preventDefault()

        if (!message)
            return

        socket.emit("send_message",
            {
                userId: "test user id",
                message: message
            },
            () => setMessage("")
        )
    }

    return (
        <React.Fragment>
            {messages.map(message => message.text)}
            <FormControl fullWidth={true} variant="outlined" margin="normal">
                <InputLabel htmlFor="message">Send a message</InputLabel>
                <OutlinedInput
                    label="Send a message"
                    id="message"
                    type="text"
                    value={message}
                    onChange={({ target: { value } }) => setMessage(value)}
                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={sendMessage}
                                onMouseDown={event => event.preventDefault()}
                            >
                                {message ? <SendIcon /> : null}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </React.Fragment>
    )
}