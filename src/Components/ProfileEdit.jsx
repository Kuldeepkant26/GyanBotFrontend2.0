import React, { useContext, useRef, useState } from 'react'

import '../css/ProfileEdit.css'
import { MyContext } from '../Context/MyProvider'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
function ProfileEdit() {
    const { editProfile, setEditProfile } = useContext(MyContext)
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setuploading] = useState(false);
    const fileInputRef = useRef(null);
    async function handelUpload() {
        try {
            if (!file) {
                return toast.warn("Choose your image")
            }
            setuploading(true);

            const token = localStorage.getItem('gyanbot-auth-token')
            const formData = new FormData();
            formData.append('myfile', file);


            axios.post(`${import.meta.env.VITE_BURL}/auth/updateprofile`, formData, {
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
                    setEditProfile(false)
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
        <div className='profile-edit-form' style={{ display: editProfile ? 'block' : 'none' }}>
            <div className="edit-form">
                <div className="profile-edit-top">
                    <h3>Update your Profile Picture</h3>
                    <i className="ri-close-large-fill cursor-pointer" onClick={() => setEditProfile(false)}></i>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}  // Attach the ref to the file input
                    onChange={(e) => setFile(e.target.files[0])}
                />
                {uploading ? <button className='uploading bg-slate-700'>Updating... </button> : <button onClick={handelUpload}>Update</button>}
            </div>

        </div>
    )
}

export default ProfileEdit
