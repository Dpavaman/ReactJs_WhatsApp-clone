import { Avatar } from '@material-ui/core'
import axios from '../Axios/axios'
import React, { Fragment } from 'react'
import './SideBarChats.css'
import { Link } from 'react-router-dom'

const SideBarChats = ({ addNewChat, roomInfo }) => {
    const createNewChat = async (e) => {
        e.preventDefault()
        const newRoomName = prompt("Enter the group name");
        if (newRoomName) {
            if (newRoomName.trim().length === 0) {
                alert("Room Name Cannot be Empty")
            } else {
                axios.post('/createRoom', {
                    createdTime: new Date().toString(),
                    roomName: newRoomName
                })
            }
        }
    }

    return !addNewChat ? (
        roomInfo.map((room, index) => (
            <div key={index} className='sideBarChat'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${room.roomId}.svg`} />  {/*Avatar of your Friend i.e Display Picture*/}
                <div className='sideBarChatInfo'>    {/*such as Name of friend, last sent message */}

                    {
                        <Fragment>
                            <Link className='sidebarRoomName' to={`/rooms/${room.roomId}`} >
                                <h2 className="roomName" >{room.roomName}</h2>
                            </Link>
                        </Fragment>
                    }

                </div>
            </div >
        ))
    ) : (
            <div onClick={createNewChat} className='sideBarChat'>
                <h2 >Add New Chat</h2>
            </div>
        )


}

export default SideBarChats