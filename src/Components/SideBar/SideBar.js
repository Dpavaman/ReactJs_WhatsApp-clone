import React, { useEffect, useState } from 'react';
import './SideBar.css'
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { Avatar, IconButton } from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { SearchOutlined } from '@material-ui/icons';
import SideBarChats from '../SideBarChats/SideBarChats';
import { useStateValue } from '../StateProvider/StateProvider';

const SideBar = ({ fetchedContent }) => {

    const [{ user }, dispatch] = useStateValue();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (fetchedContent.length !== 0) {
            setRooms([fetchedContent.map((room) => {
                // console.log(room.roomName)
                return { roomName: room.roomName, roomId: room._id };
            })])
        }
    }, [fetchedContent])
    return (
        <div className='sideBar'>   {/*Entire Side bar dedicated for your DP, your chats, search bar ...  all these are occupying 35% of the horizontal screen */}
            <div className='sideBarHeader'>
                <Avatar src={
                    user ? user?.profileObj.imageUrl : window.localStorage.getItem("userImage")
                } />   {/* User's Display Picture */}
                <div className='sideBarRightHeader'>    {/*Three Icons -> BurgerIcon, ChatIcon and More Options Icon on right hand side of sidebar */}
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className='sideBarSearch'>  {/* A dedicated DIV for search bar that has styles such as background color and padding */}
                <div className='sideBarSearchContainer'>  {/* This field Actually contains search Bar Input field which is styles using this className */}
                    <SearchOutlined />
                    <input type="text" placeholder='Search or Start new chat' />
                </div>
            </div>

            <div className='sideBarChats'>   {/* Section within *SideBar* which has the list of friends and charooms */}
                <SideBarChats addNewChat />
                {
                    (rooms.length !== 0) ?
                        (
                            rooms.map((room, index) => (
                                <SideBarChats key={index} roomInfo={room} />
                            ))
                        ) : (
                            <h3>Loading Rooms...</h3>
                        )
                }
            </div>

        </div>
    )
}

export default SideBar