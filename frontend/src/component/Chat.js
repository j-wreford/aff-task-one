// react
import React from 'react'

// material ui
import { Grid, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core'
import { Send as SendIcon } from '@material-ui/icons'

// chat functionality
import io from 'socket.io-client'

// application
import PaddedPaper from './hoc/PaddedPaper'
import ChatMessage from './ChatMessage'
import { UserContext } from '../context/UserContext'

/**
 * The socket this user owns and uses to chat with
 */
let socket

/**
 * Presents an interface used to chat to other users
 */
export default function Chat(props) {

    /**
     * Information about the currently logged in user
     */
    const [user, setUser] = React.useContext(UserContext)

    /**
     * The current message the user is typing
     */
    const [message, setMessage] = React.useState("")

    /**
     * The current incoming message
     */
    const [incomingMessage, setIncommingMessage] = React.useState("")
    
    /**
     * The chat history containing all messages
     */
    const [messages, setMessages] = React.useState([])

    /**
     * Join the chat and hook up message events whenever user updates
     */
    React.useEffect(() => {

        if (!user)
            return

        socket = io("http://127.0.0.1:5000")

        socket.emit("join", user._id, () => {
            
        })

        socket.on("message", message => {
            setIncommingMessage(message)
        })

        return () => {
            console.log("Dismounting")
            socket.emit("disconnect", user._id)
            socket.off()
        }

    }, [user])

    /**
     * Adds the incoming message to the messages collection
     */
    React.useEffect(() => {

        if (incomingMessage)
            setMessages([...messages, incomingMessage])
        
    }, [incomingMessage])

    /**
     * Triggers a send message socket event
     */
    const sendMessage = event => {
        event.preventDefault()

        if (!message || !user)
            return

        console.log(user)

        socket.emit("send_message",
            {
                userId: user._id,
                message: message
            },
            () => setMessage("")
        )
    }

    return (
        <PaddedPaper>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="flex-start"
                >
            {messages.map(message => {

                let variant = "normal"
                let align = "flex-start"

                if (message.user === "system") {
                    variant = "system"
                    align = "center"
                }
                else if (message.user._id === user._id) {
                    variant = "self"
                    align = "flex-end"
                }

                return (
                    <Grid item style={{alignSelf: align}}>
                        <ChatMessage author={message.user.fname} variant={variant}>{message.text}</ChatMessage>
                    </Grid>
                )
            })}
            </Grid>
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
        </PaddedPaper>
    )
}