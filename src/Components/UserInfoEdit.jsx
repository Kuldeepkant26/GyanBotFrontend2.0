import React, { useContext, useEffect, useRef, useState } from 'react'

import '../css/ProfileEdit.css'
import { MyContext } from '../Context/MyProvider'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
function UserInfoEdit() {
    const { editUserInfo, setEditUserInfo, currUser,fetchUser } = useContext(MyContext)
    const navigate = useNavigate();

    let [name, setName] = useState('')
    let [bio, setBio] = useState('')
    let [grade, setGrade] = useState('')

    const [uploading, setuploading] = useState(false);

    function handelUpdate() {
        setuploading(true);

        const token = localStorage.getItem('gyanbot-auth-token');
        axios.put(
            `${import.meta.env.VITE_BURL}/auth/update/userinfo`,
            { name, bio, grade },  // request payload
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then(response => {
            toast.success(response.data.message)
            fetchUser(localStorage.getItem('gyanbot-auth-token'))
            setEditUserInfo(false)
        }).catch(error => {
            // handle error if needed
            console.log(error)
        }).finally(() => {
            setuploading(false);
        });
    }

    useEffect(() => {
        if (currUser) {
            setBio(currUser.bio)
            setGrade(currUser.grade)
            setName(currUser.name)
        }

    }, [setEditUserInfo, editUserInfo, currUser])



    return (
        <div className='profile-edit-form' style={{ display: editUserInfo ? 'block' : 'none' }}>
            <div className="edit-form">
                <div className="profile-edit-top">
                    <h3>Update your information</h3>
                    <i className="ri-close-large-fill cursor-pointer" onClick={() => setEditUserInfo(false)}></i>
                </div>
                <div className='up-name'>
                    <p>Update your name</p>
                    <input className='name' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='up-bio'>
                    <p> Update your bio, {bio.length} -100 words</p>
                    <textarea rows={4} maxLength="100" name="" id="" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>
                <div className='up-grade'>
                    <label htmlFor="grade">Change your grade:</label>
                    <select name="grade" id="grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
                        <option value="grade1-5">Below 6th</option>
                        <option value="grade6">Grade 6</option>
                        <option value="grade7">Grade 7</option>
                        <option value="grade8">Grade 8</option>
                        <option value="grade9">Grade 9</option>
                        <option value="grade10">Grade 10</option>
                        <option value="grade11">Grade 11</option>
                        <option value="grade12">Grade 12</option>
                        <option value="12th pass">Above 12th</option>
                    </select>
                </div>

                {uploading ? <button className='uploading bg-slate-700'>Updating... </button> : <button onClick={handelUpdate}>Save Changes</button>}
            </div>

        </div>
    )
}

export default UserInfoEdit
