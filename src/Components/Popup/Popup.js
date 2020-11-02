import React from 'react'
import './Popup.css'


const Popup = ({ togglePopup }) => {

    const signOut = () => {
        window.localStorage.removeItem("loginToken");
        window.localStorage.removeItem('userImage');
        window.location.replace("dpavaman-whatsapp-clone.netlify.app")
    }

    return (
        <div className='popup'>
            <div className='popupBody'>
                <button type="submit" className="signoutButton" onClick={signOut} > <span>Signout</span> </button>
                <button type="submit" className="closePopup" onClick={() => togglePopup()} > cancel </button>
            </div>
        </div>
    )
}

export default Popup