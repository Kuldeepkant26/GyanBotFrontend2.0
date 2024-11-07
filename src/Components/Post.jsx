import React, { useContext, useEffect, useState } from 'react';
import '../css/post.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MyContext } from '../Context/MyProvider';
import CommentBox from './CommentBox';
import { Link } from 'react-router-dom';

function Post({ mypost }) {
    const { currUser, fetchPosts, fetchUser } = useContext(MyContext);
    const [post, setPost] = useState(mypost);
    const [isliked, setIsliked] = useState(false);

    const [postLikes, setPostLikes] = useState(mypost.likes.length);
    const [postComments, setPostcomments] = useState(mypost.comments.length)
    const [allowToLike, setAllowToLike] = useState(true);
    const [allowToSave, setAllowToSave] = useState(true);
    const [showmenu, setshowmenu] = useState(false);
    const [isSaved, setisSaved] = useState(false);
    const [likebox, setlikebox] = useState(false);
    const [sharebox, setsharebox] = useState(false);
    const [commentbox, setcommentbox] = useState(false);
    const [showPostEdit, setshowPostEdit] = useState(false)

    // POST EDIT VARIABLES
    const [postEditTitle, setpostEditTitle] = useState('')
    const [posEditDescription, setposEditDescription] = useState('')
    const [postUpdating, setPostUpdating] = useState(false)

    useEffect(() => {
        if (post) {
            setpostEditTitle(post.title)
            setposEditDescription(post.description)
        }
    }, [post])


    async function fetchMyPost() {
        const res = await axios.get(`${import.meta.env.VITE_BURL}/posts/getpost/${post._id}`);
        setPost(res.data.post);

    }

    function handelMenu() {

        setTimeout(() => {
            setshowmenu(false)
        }, 7000)
    }

    async function handellike() {
        if (!localStorage.getItem('gyanbot-auth-token')) {
            return toast.warn('Please Login');
        }
        if (!allowToLike) {
            return toast.warn('Wait');
        }
        setAllowToLike(false);
        setTimeout(() => {
            setAllowToLike(true);
        }, 3000);

        try {
            const res = await axios.put(`${import.meta.env.VITE_BURL}/posts/like/${currUser._id}/${post._id}`);
            // const updatedLikes = res.data.post.likes;  // Assuming API response includes updated likes array
            setIsliked(!isliked);

            setPostLikes(res.data.post.likes.length)
            fetchMyPost()
            fetchUser(localStorage.getItem('gyanbot-auth-token'))
            // setPost(res.data.post)
            // setPostLikes(updatedLikes.length);  // Update to latest likes count
            // setPost((prev) => ({ ...prev, likes: updatedLikes }));
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while updating like status");
        }
    }


    useEffect(() => {
        fetchMyPost()

        if (currUser) {
            setIsliked(currUser.likedPosts.includes(mypost._id));
            setisSaved(currUser.savedPosts.includes(mypost._id));

        } else {
            setIsliked(false)
        }
    }, [currUser])

    //Handel  Save post
    async function handelSave() {
        if (!currUser || !localStorage.getItem('gyanbot-auth-token')) {
            return toast.warn('Login to save posts');
        }
        if (!allowToSave) {
            return toast.warn('Wait');
        }
        setAllowToSave(false)
        setisSaved(!isSaved);
        setTimeout(() => {
            setAllowToSave(true);
        }, 4000)

        try {
            const res = await axios.put(`${import.meta.env.VITE_BURL}/posts/save/${currUser._id}/${post._id}`);
            toast.success(res.data.message)
            fetchUser(localStorage.getItem('gyanbot-auth-token'))

        } catch (error) {
            console.error(error);
            toast.error("Error in liking");
        }
    }


    function handelCopy() {
        navigator.clipboard.writeText(`https://gyan-bot-backend2-0.vercel.app/showpost/${post._id}`)
            .then(() => {
                toast.success("Link copied")
                setTimeout(() => {
                    setsharebox(false)
                }, 2000)
            })
            .catch((error) => {
                toast.error('Failed to copy link');
            });
    }
    function handelShare() {
        setsharebox(true)
        setTimeout(() => {
            setsharebox(false)
        }, 12000)
    }
    function handelPostEdit() {
        const token = localStorage.getItem('gyanbot-auth-token');
        setPostUpdating(true)
        const res = axios.put(
            `${import.meta.env.VITE_BURL}/posts/edit/${post._id}`,
            { postEditTitle, posEditDescription },  // request payload
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        setPostUpdating(false)
        setshowPostEdit(false)

    }
    function handelPostDelete() {
        toast.loading('Deleting')
        const token = localStorage.getItem('gyanbot-auth-token');
        const res = axios.delete(
            `${import.meta.env.VITE_BURL}/posts/delete/${post._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        console.log(res.data)
        toast.warn('Post deleted');
        fetchPosts()
        setshowmenu(false)
        toast.dismiss()
    }
    return (
        <>
            {post ? <div className='post'>
                <div className="post-edit-form" style={{ display: showPostEdit ? 'flex' : 'none' }}>
                    <div className="top">
                        <h3>Update post info</h3>
                        <i className="ri-close-large-fill cursor-pointer" onClick={() => { setshowPostEdit(false) }}></i>
                    </div>
                    <p>Post title</p>
                    <input type="text" value={postEditTitle} onChange={(e) => { setpostEditTitle(e.target.value) }} />
                    <p>Post description <span style={{ color: posEditDescription.length >= 180 ? 'red' : 'white' }}>{posEditDescription.length}</span> -200 characters</p>
                    <textarea rows={3} maxLength={200} value={posEditDescription} onChange={(e) => { setposEditDescription(e.target.value) }} ></textarea>
                    {postUpdating ?
                        <button >Updating...</button> :
                        <button onClick={handelPostEdit}>Save Changes</button>
                    }
                </div>
                <div className='top'>

                    <Link className="left" to={`/profile/${post.owner._id}`}>
                        {post.owner.profilePicture ? <img className='user-profile-pic' src={post.owner.profilePicture} alt='A'></img> : <p className='owner-profile'>
                            {post.owner.name[0]}
                        </p>}
                        <p className='owner-name'>
                            {post.owner.name}
                        </p>
                    </Link>
                    <i className="ri-more-line right cursor-pointer" onClick={() => { handelMenu(), setshowmenu(!showmenu) }}></i>
                    <div className="menu top-1" style={{ display: showmenu ? 'block' : 'none' }}>
                        {currUser && post && currUser._id === post.owner._id ? <>
                            <p className='cursor-pointer' onClick={() => { setshowmenu(false), setshowPostEdit(true) }}>Edit</p>
                            <p className='cursor-pointer' onClick={handelPostDelete}>Delete</p>
                        </> : <p>Report</p>}

                    </div>
                </div>
                <div className="about">
                    <p className='title'># {postEditTitle}</p>
                    <p className='description'>{posEditDescription}</p>
                </div>
                <img className='picture' onDoubleClick={handellike} src={post.picture} alt="" />
                <div className="bottom">
                    <div className="left">
                        <p>
                            {!isliked ? <i className="ri-heart-2-line text-black mr-1" onClick={handellike}></i> : <i className="ri-heart-2-fill text-red-600 mr-1" onClick={handellike}></i>}
                            <span onClick={() => setlikebox(true)} className='text-gray-600 cursor-pointer text-sm'>
                                {postLikes} likes
                            </span>
                        </p>
                        <i className="ri-chat-1-line text-black ml-2" onClick={() => { setcommentbox(!commentbox) }}></i>
                        <span className='text-gray-600 cursor-pointer text-sm ml-1' onClick={() => { setcommentbox(!commentbox) }}>
                            {post.comments.length} comments
                        </span>
                        <i className="ri-send-plane-fill ml-3 text-black" onClick={handelShare}></i>
                    </div>
                    <div className="right">
                        {isSaved ? <i className="ri-bookmark-fill text-black" onClick={handelSave}></i> : <i className="ri-bookmark-line text-black" onClick={handelSave}></i>}
                    </div>
                </div>
                <div className="like-box" style={{ display: likebox ? 'block' : 'none' }}>
                    <div className="top">
                        <p>Other persons who like this post</p>
                        <i className="ri-close-line cursor-pointer" onClick={() => setlikebox(false)}></i>
                    </div>
                    {postLikes > 0 ? <div className='like-persons'>
                        {post.likes.map((person) => {
                            return (
                                <Link className='person-card' key={person._id} to={`/profile/${person._id}`}>
                                    {person.profilePicture ? <img className='user-profile-pic' src={person.profilePicture} alt='A'></img> : <p className='profile'>{person.name[0]}</p>}
                                    <p className='name'>
                                        {person.name}
                                    </p>
                                </Link>
                            )
                        })}
                    </div> : <h1>No likes yet</h1>}
                </div>
                <div className="share-box" style={{ display: sharebox ? 'block' : 'none' }}>
                    <div className="top">
                        <p>Copy below link</p>
                        <i className="ri-close-large-fill cursor-pointer" onClick={() => setsharebox(false)}></i>
                    </div>
                    <p className='share-link'>
                        {`https://gyan-bot-backend2-0.vercel.app/showpost/${post._id}`}
                    </p>
                    <button onClick={() => { handelCopy() }}>Copy<i className="ri-file-copy-line"></i></button>
                </div>
                <div className="comment-box" style={{ display: commentbox ? 'block' : 'none' }}>
                    <div className="top">
                        <p>All comments</p>
                        <i className="ri-close-large-fill cursor-pointer" onClick={() => { setcommentbox(false) }}></i>
                    </div>
                    <CommentBox post={post} fetchMyPost={fetchMyPost}></CommentBox>
                </div>
            </div> : <p>Loading</p>}
        </>
    );
}

export default Post;
