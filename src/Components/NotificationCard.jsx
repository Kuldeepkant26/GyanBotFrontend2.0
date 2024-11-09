import React, { useContext, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { MyContext } from '../Context/MyProvider';
import '../css/NotificationCard.css';
import axios from 'axios';

const NotificationCard = ({ notification, removeFromAll }) => {
    const { setshowNotification } = useContext(MyContext);
    const { message, link, createdAt, issNew } = notification;
    const [isNew, setisNew] = useState(issNew);

    // Format the time to a relative time like "2s ago", "2hr ago", "2 days ago"
    const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

    async function markasnotnew() {
        removeFromAll(notification._id);
        setisNew(false);
        await axios.put(`${import.meta.env.VITE_BURL}/notify/notnew/${notification._id}`)
    }
    useEffect(() => {

    }, [])


    return (
        <div className={`notification-card ${isNew ? 'new' : ''}`}>
            <div className="topnoti">
                <div className='message'>
                    <i className="ri-information-2-fill "></i> {message}
                </div>
                <Link className='view-btn' to={link} onClick={() => { setshowNotification(false), markasnotnew() }}>View</Link>
            </div>
            <div className="botnoti">
                <span className='time-ago'>{timeAgo}</span>
                <button onClick={() => setshowNotification(false)}></button>
            </div>
            {isNew ? <span className='new-logo'>New</span> : <></>}
        </div>
    );
};

export default NotificationCard;
