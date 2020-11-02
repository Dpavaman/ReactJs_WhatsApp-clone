// import React from 'react';
import axios from 'axios';


const Instance = axios.create({
    baseURL: 'https://pavaman-whatsapp-clone-backend.herokuapp.com/'
})

export default Instance