import React from 'react';
import './InfoBar.css';
// icons
import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

const InfoBar = ({ room }) => (
    <div className='infoBar'>
        <div className='leftInnerContainer'>
            <img src={onlineIcon} alt='online icon' className='onlineIcon' />
            <h3>{room}</h3>
        </div>
        <div className='rightInnerContainer'>
            {/* anchor tag is used for full page refresh, here, instead of Link */}
            <a href='/'>
                <img src={closeIcon} alt='close icon' />
            </a>
        </div>
    </div>
);

export default InfoBar;
