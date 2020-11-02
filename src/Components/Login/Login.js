import React from 'react';
import GoogleLogin from 'react-google-login';
import { actionTypes } from '../Reducer/reducer';
import { useStateValue } from '../StateProvider/StateProvider';
import './Login.css';


const Login = () => {
    // eslint-disable-next-line no-empty-pattern
    const [{ }, dispatch] = useStateValue();

    const googleSuccessResponse = (response) => {
        dispatch({
            type: actionTypes.SET_USER,
            user: response
        })
        window.localStorage.setItem("loginToken", response.profileObj.givenName);
        window.localStorage.setItem("userImage", response.profileObj.imageUrl);
    }
    const googleFailureResponse = (response) => {
        console.log(response);
    }

    return (
        <div className='loginPage'>
            <div className='loginContainer'>
                <img src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' alt="Logo" />
                <div className='loginText'>
                    <h1>Signin to WhatsApp</h1>
                </div>
                <GoogleLogin
                    clientId="879718281314-uvmb5o1oauk5iaq8l6l0mv5pua0ff1sb.apps.googleusercontent.com"
                    buttonText="Signin with Google"
                    onSuccess={googleSuccessResponse}
                    onFailure={googleFailureResponse}
                    cookiePolicy={'single_host_origin'}
                />
            </div>

            <p className='copyRight' >by Pavaman Dabeer</p>
        </div>
    )
}

export default Login 