import React, { useContext, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import '../css/signup.css'
import { toast } from 'react-toastify';
import { MyContext } from '../Context/MyProvider';

function Signup() {
    const { setcurrUser } = useContext(MyContext);
    const navigate = useNavigate();
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [grade, setGrade] = useState("grade1-5")
    const [updating, setUpdating] = useState(false)
    const [showPass, setShowPass] = useState(false);

    //function to empty the form
    function emptyform() {
        setName('')
        setEmail('')
        setGrade('grade1-5')
        setPassword('')
    }

    async function handelSubmit(e) {
        e.preventDefault();
        try {
            if (updating) {
                return toast.warn('Please wait')
            }
            setUpdating(true)
            toast.loading("Signing in, please wait...")
            const res = await axios.post(`${import.meta.env.VITE_BURL}/auth/signup`, {
                name, email, password, grade
            })
            console.log(res.data);
            localStorage.setItem('gyanbot-auth-token', res.data.token)
            setcurrUser(res.data.user);
            toast.success(res.data.message);
            toast.dismiss();
            setUpdating(false);
            emptyform()
            navigate('/')
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error);
        }


    }

    return (

        <div className='signup-page'>
            <img src="https://i.pinimg.com/originals/e5/d6/8b/e5d68b4c0923839b89fefb727afb9742.gif" alt="Gyanbot" />
            <form className='sform' onSubmit={handelSubmit}>
                <h1>Welcome to Gyanbot</h1>
                <input required type="text" placeholder='Enter Full Name' value={name} onChange={(e) => setName(e.target.value)} autoComplete="new-name" />
                <input required type="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="new-email" />
                <span className=''>
                    <input
                        required
                        type={showPass ? 'text' : 'password'}
                        placeholder="Set Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />

                    {showPass ? <i className="ri-eye-fill" onClick={() => setShowPass(!showPass)}></i> : <i className="ri-eye-off-fill" onClick={() => setShowPass(!showPass)}></i>}

                </span>
                <div className='grade'>
                    <label htmlFor="grade">Choose your grade:</label>
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
                <button className='btn' type='submit'>Signup</button>
                <p onClick={() => navigate('/login')}>Already a user ? </p>
            </form>
        </div>



    )
}

export default Signup
