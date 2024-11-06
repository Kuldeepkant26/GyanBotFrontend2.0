import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MyContext } from '../Context/MyProvider'
import axios from 'axios'
import '../css/Profile.css'
import Post from './Post'

function Profile() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { logout, currUser, posts, fetchPosts, fetchUser, setEditProfile, setEditUserInfo, editUserInfo, editProfile } = useContext(MyContext)
    const [showPosts, setShowPosts] = useState([])
    const [profileMenu, setProfileMenu] = useState(false)
    const [thisUser, setThisUser] = useState(null)
    const [view, setView] = useState("all") // New state to track view
    const [showFollower, setShowFollower] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)

    function handleProfileShare() {
        // Get the current URL
        const currentUrl = window.location.href;

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                console.log('URL copied to clipboard:', currentUrl);
                toast.success('Profile link copied to clipboard!');
            })
            .catch((error) => {
                console.error('Failed to copy URL:', error);
                toast.warn('Failed to copy the link. Please try again.');
            });
    }

    async function fetchUserP() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BURL}/auth/getuser/${id}`)
            console.log("Testing----??")
            console.log(res.data.user)
            setThisUser(res.data.user)
        } catch (error) {
            logout()
            toast.info('Session expired')
        }
    }

    useEffect(() => {
        // Fetch both posts and user data
        fetchPosts()
        fetchUserP()
    }, [id, editUserInfo, editProfile])  // Runs when 'id' changes

    useEffect(() => {
        // Show all posts by default when posts or thisUser changes
        if (posts && thisUser && view === "all") {
            setShowPosts(posts.filter(post => post.owner._id === thisUser._id))
        }
    }, [posts, thisUser, view])

    function handleAllPosts() {
        setView("all") // Update view state
        if (posts && thisUser) {
            setShowPosts(posts.filter(post => post.owner._id === thisUser._id))
        }
    }

    async function handleSavedPosts() {
        fetchUserP()
        setView("saved") // Update view state
        if (posts && thisUser) {
            console.log(thisUser.savedPosts)
            setShowPosts(thisUser.savedPosts)

        }
    }
    async function handelFollow() {
        const res = await axios.put(`${import.meta.env.VITE_BURL}/auth/follow/${currUser._id}/${id}`)
        fetchUser(localStorage.getItem('gyanbot-auth-token'))
        fetchUserP()
    }

    function handelPrfileMenu() {
        setProfileMenu(!profileMenu)
        setTimeout(() => {
            setProfileMenu(false)

        }, 15000)
    }



    return (
        <div className='profile-page'>
            {thisUser ? (
                <div className="user-profile relative">
                    <div className='following-followers ' style={{ display: showFollower ? 'block' : 'none' }}>
                        {thisUser.followers.length ? <>
                            <p className='text-sm text-gray-400' >Followers list</p>
                            {thisUser.followers.map((person) => {
                                return (
                                    <Link className='person-card' key={person._id} to={`/profile/${person._id}`} onClick={() => setShowFollower(false)}>
                                        {person.profilePicture ? <img className='user-profile-pic' src={person.profilePicture} alt='A'></img> : <p className='profile'>{person.name[0]}</p>}
                                        <p className='name'>
                                            {person.name}
                                        </p>
                                    </Link>
                                )
                            })}
                        </> : <p>No followers</p>}
                    </div>
                    <div className='following-followers' style={{ display: showFollowing ? 'block' : 'none' }}>
                        {thisUser.following.length ? <>
                            <p className='text-sm text-gray-400' >Following list</p>
                            {thisUser.following.map((person) => {
                                return (
                                    <Link className='person-card' key={person._id} to={`/profile/${person._id}`} onClick={() => setShowFollowing(false)}>
                                        {person.profilePicture ? <img className='user-profile-pic' src={person.profilePicture} alt='A'></img> : <p className='profile'>{person.name[0]}</p>}
                                        <p className='name'>
                                            {person.name}
                                        </p>
                                    </Link>
                                )
                            })}
                        </> : <p>Not following anyone</p>}

                    </div>
                    <i className="ri-more-line absolute top-2 right-4 cursor-pointer" onClick={handelPrfileMenu}></i>
                    <div className="profile-menu" style={{ display: profileMenu ? 'block' : 'none' }}>
                        {currUser && thisUser && currUser._id === thisUser._id ?
                            <>
                                <p onClick={() => setEditUserInfo(true)}>Edit info</p>
                                <p onClick={() => { setEditProfile(true) }}>Update picture</p>
                            </> :
                            <p>Report</p>
                        }

                    </div>
                    <img src={thisUser.profilePicture ? thisUser.profilePicture : 'https://cdn-icons-png.flaticon.com/256/3237/3237476.png'} alt="User Profile" />
                    <div className="user-info">
                        <p className="user-name">{thisUser.name}</p>
                        {thisUser.bio ? <p className='user-bio'>{thisUser.bio}</p> : <></>}
                        <div className="follow-info">
                            <p>{thisUser.userPosts.length} posts</p>
                            <p className='cursor-pointer' onClick={() => { setShowFollowing(!showFollowing), setShowFollower(false) }}>{thisUser.following.length} following </p>
                            <p className='cursor-pointer' onClick={() => { setShowFollower(!showFollower), setShowFollowing(false) }}>{thisUser.followers.length} followers </p>
                        </div>
                        <div className="btn">
                            {currUser && currUser._id !== thisUser._id ? (
                                <>
                                    {currUser.following.includes(thisUser._id) ? <button onClick={handelFollow}>Unfollow</button> : <button onClick={handelFollow}>Follow</button>}
                                </>
                            ) : null}
                            {currUser && currUser._id === thisUser._id ? <Link className='button' to={'/addpost'}>Add post</Link> : <></>}
                            <button onClick={handleProfileShare}>Share profile<i className="ri-send-plane-fill"></i></button>
                        </div>
                    </div>
                </div>
            ) : <p>Loading...</p>}

            <div className="post-options">
                <button
                    className='button'
                    onClick={handleAllPosts}
                >
                    All posts
                </button>
                {currUser && thisUser && currUser._id === thisUser._id ?
                    <button
                        className={view === "saved" ? "active" : ""}
                        onClick={handleSavedPosts}
                    >
                        Saved posts
                    </button> : <></>
                }
            </div>

            <div className="profile-page-posts">
                {showPosts.length > 0 ? (
                    <div className='post-cont'>
                        {showPosts.map(post => (
                            <Post mypost={post} key={post._id}></Post>
                        ))}
                    </div>
                ) : <h1>No Posts Available</h1>}
            </div>

        </div>
    )
}

export default Profile
