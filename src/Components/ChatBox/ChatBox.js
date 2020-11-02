import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../Axios/axios'
import './ChatBox.css'
import Pusher from 'pusher-js';
import { useStateValue } from '../StateProvider/StateProvider';
import Popup from '../Popup/Popup';


const ChatBox = ({ fetchedConversations }) => {

    const { roomId } = useParams();
    const [input, setInput] = useState("")
    const [activeRoom, setActiveRoom] = useState('')
    const [activeRoomConversations, setActiveRoomConversations] = useState([])
    const [{ user }, dispatch] = useStateValue();
    const [showPopup, setShowPopup] = useState(false);


    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const togglePopup = () => {
        setShowPopup(!showPopup);
    }

    useEffect(() => {
        axios.get(`/messages/sync/${roomId}`).then(response => {
            setActiveRoom(response.data.roomName)
            setActiveRoomConversations(response.data.conversations)
        })
    }, [roomId])

    useEffect(() => {
        const pusher = new Pusher('cc8ae74a9321195a8769', {
            cluster: 'ap2'
        });

        const channel = pusher.subscribe('message')
        channel.bind('updated', (newConversations) => {
            setActiveRoomConversations([...activeRoomConversations, newConversations]);
        })

        return () => {
            channel.unbind_all();  //Unbinded all the events
            channel.unsubscribe();  //Unsubscribed from the channel 
        }
    }, [activeRoomConversations])

    const inputChangeHandler = (e) => {
        setInput(e.target.value);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (input.trim().length > 0) {
            await axios.post('/messages/new', {
                message: input,
                sender: user ? user.profileObj.givenName : window.localStorage.getItem("loginToken"),
                timestamp: formatAMPM(new Date()),
                // received: (sender === user?.profileObj.name) ? true : false,
                toRoom: roomId
            })
        } else {
            alert("Oops!! Cannot send an empty message")
        }

        setInput("");
        let scrollHere = document.querySelectorAll("#newMessage");
        scrollHere[scrollHere.length - 1].scrollIntoView();
    }

    return (
        (!showPopup)
            ?
            <div className='chatBox'>  {/* Entire Chat section shown on the right side of teh screen which will occupy 60% of the operational area of App */}
                <div className='chatHeader'> {/* Header part of Chat section which shows the recepient name, recepient DP, Search, and Media attachment and options */}
                    <Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`} />
                    <div className='chatHeaderInfo'> {/* This part contains the all the chat header items except Avatar  */}
                        <h3>{activeRoom}</h3>
                    </div>

                    <div className='chatHeaderRight'>  {/* This section will contain the options such as Search, Media attachment and more options aligned to the right of the header part */}
                        <IconButton>
                            <SearchOutlined />
                        </IconButton>
                        <IconButton>
                            <AttachFile />
                        </IconButton>
                        <IconButton>
                            <span onClick={() => togglePopup()}>
                                <MoreVert />
                            </span>
                        </IconButton>
                    </div>
                </div>

                <div id='chatBody' className='chatBody'>   {/*This is Chat body section where conversation is being displayed*/}
                    {(activeRoomConversations.length !== 0) ? (activeRoomConversations.map((message, index) => (
                        <p id='newMessage' key={index} className={`chatMessage ${(window.localStorage.getItem("loginToken") === message.sender) && "byReceiver"}`} > {/* //This section is a message that includes 3 sections, Sender name, message content, timeStamp */}
                            <span className='senderName'>{message.sender}</span>  {/* This section will have the name of the sender */}
                            {message.message}
                            <span className='messageTimeStamp'>{message.timestamp}</span>    {/*This section will have the time stamp of message sent */}
                        </p>
                    ))) : (
                            <>
                                <h3>Seems there are no conversations here...!</h3>
                                <small>Type message to start new conversation</small>
                            </>
                        )}
                </div>

                <div className='messageTypeBox'>  {/* Bottom portion of chat area where message type box, Emoji button and Mic options are available */}
                    <IconButton>
                        <InsertEmoticon />
                    </IconButton>
                    <form onSubmit={submitHandler}>
                        <input value={input} onChange={inputChangeHandler} type='text' placeholder='Type a message!' />
                        <button type="submit">Send a message</button>
                    </form>
                    <IconButton>
                        <MicIcon />
                    </IconButton>
                </div>
            </div>
            :
            <Popup togglePopup={togglePopup} />
    )
}

export default ChatBox