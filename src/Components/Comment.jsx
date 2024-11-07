import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../Context/MyProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function Comment({ comment, fetchPost, post }) {
    const { currUser } = useContext(MyContext);
    const [newComment, setnewComment] = useState(comment.value)
    const [commentMenu, setCommentMenu] = useState(false)
    const [editform, setEditform] = useState(false);

    function handelCommentMenu() {
        setTimeout(() => {
            setCommentMenu(false)
        }, 10000)
    }
    async function handelCommentDelete() {
        try {
            toast.loading('Deleting...')
            const res = await axios.delete(`${import.meta.env.VITE_BURL}/posts/comment/delete/${post._id}/${comment._id}`)
            toast.success(res.data.message)
            fetchPost();
            toast.dismiss()
        } catch (error) {
            console.log(error.response.data.message)
        }
    }
    async function handelCommentEdit() {
        try {
          
            const res = await axios.put(`${import.meta.env.VITE_BURL}/posts/comment/edit/${comment._id}`, {
                newComment
            })
            toast.success(res.data.message)
            setEditform(false);
            fetchPost();
        } catch (error) {
            console.log(error.response.data.message)
        }
    }
    useEffect(() => {
        fetchPost();
    }, [])

    return (
        <div key={comment._id} className="comment-b">
            <div className="owner-info">
                <Link className="lft flex items-center gap-3" to={`/profile/${comment.owner._id}`}>
                    {comment.owner.profilePicture ? <img className='user-profile-pic' src={comment.owner.profilePicture} alt='A'></img> : <p className='profile'>{comment.owner.name[0]}</p>}
                    <p className='text-sm uname'>{comment.owner.name}</p>
                </Link>
                <i className="ri-more-2-line cursor-pointer" onClick={() => { setCommentMenu(!commentMenu), handelCommentMenu() }}></i>
            </div>
            <div className="editform " style={{ display: editform ? 'block' : 'none' }}>
                <textarea type="text" value={newComment} onChange={(e) => setnewComment(e.target.value)} />
                <div className="btns">
                    <button onClick={handelCommentEdit}>Save</button>
                    <button onClick={() => { setEditform(false), setnewComment(comment.value) }}>Cancel</button>
                </div>
                {/* */}
            </div>
            <p className='ml-8 text-justify pr-5'>{comment.value}</p>
            <div className="comment-menu" style={{ display: commentMenu ? 'block' : 'none' }}>
                {currUser && currUser._id === comment.owner._id ?
                    <>
                        <p className='cursor-pointer' onClick={() => { setEditform(true), setCommentMenu(false) }}>Edit</p>
                        <p className='cursor-pointer' onClick={handelCommentDelete}>Delete</p>
                    </> :
                    <p><i className="ri-flag-line"></i>report</p>}
            </div>
        </div>
    )
}

export default Comment
