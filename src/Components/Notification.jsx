import React, { useContext, useEffect, useState } from 'react';
import '../css/Notification.css';
import { MyContext } from '../Context/MyProvider';
import NotificationCard from './NotificationCard';

function Notification() {
    const { setshowNotification, currUser, newNotification, setnewNotification } = useContext(MyContext);

    const [allNotifications, setAllNotifications] = useState([]);

    function removeFromAll(nid) {
        setnewNotification(newNotification.filter((noti) => noti._id !== nid))
    }

    useEffect(() => {
        if (currUser && currUser.notifications) {
            setAllNotifications(currUser.notifications);
            setnewNotification(currUser.notifications.filter((noti) => noti.issNew))
        }
    }, [currUser]); // Re-run when `currUser` changes

    return (
        <div className='notification'>
            <div className="top">
                <p>Notifications {newNotification.length ? <span className='text-red-500 text-[14px]'>({newNotification.length} new) </span> : <></>}</p>
                <i className="ri-close-large-fill" onClick={() => setshowNotification(false)}></i>
            </div>
            <div className="bottom">
                {currUser && allNotifications.length ? (
                    <div className='nofication-box'>
                        {allNotifications.map((notification) => {
                            return <NotificationCard key={notification._id} notification={notification} removeFromAll={removeFromAll} />;
                        })}
                    </div>
                ) : (
                    <>
                        <i className="ri-notification-2-line"></i>
                        <h3>Your notifications live here</h3>
                        <p>Subscribe to your favourite channels to receive notifications about their latest videos</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Notification;