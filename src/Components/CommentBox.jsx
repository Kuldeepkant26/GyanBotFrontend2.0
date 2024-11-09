import React, { useContext, useEffect, useRef, useState } from 'react';
import '../css/CommentBox.css';
import { MyContext } from '../Context/MyProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import Comment from './Comment';

function CommentBox({ post, fetchMyPost }) {
    const { currUser, Notify } = useContext(MyContext);
    const [comment, setComment] = useState('');
    const [mypost, setMypost] = useState(null);
    const [updating, setUpdating] = useState(false);
    const commentsEndRef = useRef(null);  // Create a ref for the end of the comments

    async function handelComment() {
        if (comment === '') {
            return toast.warn('Enter something');
        }
        if (!currUser) {
            return toast.warn('Please login first');
        }
        try {
            setUpdating(true);
            const res = await axios.post(`${import.meta.env.VITE_BURL}/posts/comment/add/${post._id}/${currUser._id}`, {
                comment,
            });
            toast.success(res.data.message);
            setComment('');
            await fetchPost();
            fetchMyPost();
            setUpdating(false);
            scrollToBottom(); // Scroll to the bottom after adding a comment
            Notify(`${currUser.name} Comment on your post`, `/showpost/${post._id}`, post.owner._id);
        } catch (error) {
            toast.error(error.response?.data.message || "Error adding comment");
        }
    }

    async function fetchPost() {
        const res = await axios.get(`${import.meta.env.VITE_BURL}/posts/getpost/${post._id}`);
        setMypost(res.data.post);
    }

    function scrollToBottom() {
        setTimeout(() => {
            commentsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100); // Adjust delay as needed
    }


    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <div className='comment-element'>
            <div className="all-comments">
                {mypost && mypost.comments ? (
                    <>
                        {mypost.comments.map((comment) => (
                            <Comment post={post} key={comment._id} comment={comment} fetchPost={fetchPost} />
                        ))}
                        <div ref={commentsEndRef} /> {/* This will act as the target to scroll to */}
                    </>
                ) : (
                    <h4 className='text-black'>No comments yet</h4>
                )}
            </div>
            <div className="comment-form">
                {currUser ? (
                    <>
                        {currUser.profilePicture ? (
                            <img className='user-profile-pic' src={currUser.profilePicture} alt='A' />
                        ) : (
                            <p className='profile'>{currUser.name[0]}</p>
                        )}
                    </>
                ) : (
                    <p className='profile'>A</p>
                )}
                <input type="text" placeholder='Enter your comment' value={comment} onChange={(e) => setComment(e.target.value)} />
                {updating ? (
                    <button className="button">Adding</button>
                ) : (
                    <button className="button" onClick={handelComment}>
                        Add
                    </button>
                )}
            </div>
        </div>
    );
}

export default CommentBox;
