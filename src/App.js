import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import ChatBox from './Components/ChatBox/ChatBox';
import SideBar from './Components/SideBar/SideBar';
import Pusher from 'pusher-js'
import axios from '../src/Components/Axios/axios'  //Fetched from the axios.js file written in src/Components/Axios
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../src/Components/Login/Login'
import { useStateValue } from './Components/StateProvider/StateProvider';


function App() {

  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [{ user }] = useStateValue();


  useEffect(() => {
    axios.get('/messages/sync')
      .then(response => {
        setFetchedMessages(response.data);    //Setting fetched messages to fetchedMessages array with dispatch function setFetchedMessages.

      })
  }, [])

  useEffect(() => {
    /* -----> npm i pusher-js  <----- on Front-end   -----> npm i pusher <----- on Back-end */
    const pusher = new Pusher('cc8ae74a9321195a8769', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('message'); /*In Backend "message" is the channel and "inserted" is the Event happened */
    //Now we will bind the action to be 'inserted' using channel.bind('inserted')
    channel.bind('inserted', function (newMessage) {

      setFetchedMessages([...fetchedMessages, newMessage])  //Once a new message is found, destructuring the existing array of fetched messages and pushing newMessage to the array without affecting the existing objects
    });

    /**
     We don't want  const channel = pusher.subscribe('message')
     and channel.bind('inserted') to be kept subscribed everytime .

     THUS, Let's unsubscribe and unbind from the channel and event respectively
     making them subscribe and bind only when the dependancy array changes
     */

    //This useEffect returns with a function that unsubscribe amd unbind the channel and event
    return () => {
      channel.unbind_all();  //Unbinded all the events
      channel.unsubscribe();  //Unsubscribed from the channel 
    }

  }, [fetchedMessages])  //Since we are adding the new message into the already existing fetchedMessages array, the array is included as a dependency array so that the useEffect hook will trigger is any changes in the dependancy array are noticed.


  return (
    <Fragment>
      {(!window.localStorage.getItem("loginToken") && !user) ? (
        <Login />
      ) : (
          <div className="App">
            <div className='appBody'>
              <BrowserRouter>
                <Switch>

                  <Route exact path='/rooms/:roomId'>
                    <SideBar fetchedContent={fetchedMessages} />
                    <ChatBox fetchedMessages={fetchedMessages} />
                  </Route>

                  <Route exact path='/rooms'>
                    <SideBar fetchedContent={fetchedMessages} />
                  </Route>

                  <Route exact path='/'>
                    <SideBar fetchedContent={fetchedMessages} />
                  </Route>
                </Switch>
              </BrowserRouter>
            </div>
          </div>
        )}
    </Fragment>
  );
}

export default App;
