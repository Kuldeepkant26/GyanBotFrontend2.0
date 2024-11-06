import React, { useContext, useEffect, useState } from 'react'
import '../css/CommentBox.css'
import { MyContext } from '../Context/MyProvider'
import axios from 'axios';
import { toast } from 'react-toastify';
import Comment from './Comment';

function CommentBox({ post, fetchMyPost }) {
    const { currUser } = useContext(MyContext);
    const [comment, setComment] = useState('')
    const [mypost, setMypost] = useState(null)


    async function handelComment() {
        if (comment === '') {
            return toast.warn('Enter somthing');
        }
        if (!currUser) {
            return toast.warn('Please login first');
        }
        console.log(comment)
        try {
            const res = await axios.post(`${import.meta.env.VITE_BURL}/posts/comment/add/${post._id}/${currUser._id}`, {
                comment
            })
            toast.success(res.data.message)
            setComment('')
            fetchPost()
            fetchMyPost();
        } catch (error) {
            toast.error(error.resposne.data.message)
        }
    }

    async function fetchPost() {
        const res = await axios.get(`${import.meta.env.VITE_BURL}/posts/getpost/${post._id}`);
        setMypost(res.data.post);

    }

    useEffect(() => {
        fetchPost();

    }, [])



    return (
        <div className='comment-element'>
            <div className="all-comments">
                {mypost && mypost.comments ? <>
                    {mypost.comments.map((comment) => {
                        return (
                            <Comment post={post} key={comment._id} comment={comment} fetchPost={fetchPost}></Comment>
                        )
                    })}
                </> : <h4 className='text-black'>No comments yet </h4>}

            </div>
            <div className="comment-form">
                {currUser ? <>
                    {currUser.profilePicture ? <img className='user-profile-pic' src={currUser.profilePicture} alt='A'></img> : <p className='profile'>{currUser.name[0]}</p>}

                </> : <p className='profile'>A</p>}

                <input type="text" placeholder='Enter your comment' value={comment} onChange={(e) => setComment(e.target.value)} />
                <button className="button" onClick={handelComment}>
                    Add
                </button>
            </div>

        </div>
    )
}

export default CommentBox
