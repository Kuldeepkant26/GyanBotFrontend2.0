import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// Create a Context
export const MyContext = createContext();
const MyProvider = ({ children }) => {
    const [counter, setCounter] = useState(77);
    const [currUser, setcurrUser] = useState(null)
    const [showNotification, setshowNotification] = useState(false)

    const [newNotification, setnewNotification] = useState([])
    const [editProfile, setEditProfile] = useState(false);
    const [editUserInfo, setEditUserInfo] = useState(false);
    const [posts, setPosts] = useState([]);

    async function fetchPosts(params) {
        const res = await axios.get(`${import.meta.env.VITE_BURL}/posts/allposts`);
        console.log(res.data)
        setPosts(res.data.posts)

    }

    async function fetchUser(token) {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BURL}/auth/getuser`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data);
            setcurrUser(res.data.user);
        } catch (error) {
            logout();
            toast.info('Session expired');
        }
    }

    function logout() {
        localStorage.removeItem('gyanbot-auth-token')
        setcurrUser(null);
        toast.info('Logout successfully')

    }

    useEffect(() => {
        const token = localStorage.getItem('gyanbot-auth-token')
        if (token) {
            fetchUser(token)
        } else {
            localStorage.removeItem('gyanbot-auth-token')
            setcurrUser(null);
        }

    }, [editProfile])

    async function Notify(message, link, toUser) {
        await axios.post(`${import.meta.env.VITE_BURL}/notify/add`, {
            message, link, toUser
        })
    }

    return (
        <MyContext.Provider value={{ newNotification, setnewNotification, Notify, posts, fetchPosts, counter, currUser, setcurrUser, logout, fetchUser, editProfile, setEditProfile, editUserInfo, setEditUserInfo, showNotification, setshowNotification }}>
            {children}
        </MyContext.Provider>
    );
};
export default MyProvider;