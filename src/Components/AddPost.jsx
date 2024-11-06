
import React, { useState, useRef } from 'react';
import axios from 'axios';

import '../css/addpost.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function AddPost() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploading, setuploading] = useState(false);
    const [description, setDescription] = useState('');
    const fileInputRef = useRef(null);  // Create a ref to access the file input element
    async function handelUpload() {
        try {
            if (!file || !title || !description) {
                return toast.warn("Empty field")
            }
            setuploading(true);

            const token = localStorage.getItem('gyanbot-auth-token')
            const formData = new FormData();
            formData.append('myfile', file);
            formData.append('title', title);  // Title
            formData.append('description', description);  // Description
            axios.post(`${import.meta.env.VITE_BURL}/posts/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    setuploading(false)
                    toast.success(res.data.message);
                    // Clear the file input field
                    setFile(null);  // Clear file state
                    fileInputRef.current.value = '';  // Reset the input field
                    navigate(-1);
                })
                .catch((err) => {
                    setuploading(false);
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='add-post-page'>
            <div className="add-post-form">
                <h1>
                    <p>Fill post details </p>
                    <i className='ri-close-large-fill cursor-pointer' onClick={() => navigate(-1)}></i>
                </h1>
                <p className='text-sm text-gray-600'>Title</p>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter post title' />
                <input
                    type="file"
                    ref={fileInputRef}  // Attach the ref to the file input
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <p className='text-sm text-gray-600'>Enter post description <span style={{ color: description.length >= 180 ? 'red' : 'grey' }}>{description.length}</span>-200 characters</p>
                <textarea maxLength={200} value={description} onChange={(e) => setDescription(e.target.value)} placeholder='About yout post' ></textarea>
                {uploading ? <button className='uploading bg-slate-700'>Uploading </button> : <button onClick={handelUpload}>Upload </button>}

            </div>
        </div>
    );
}
export default AddPost;