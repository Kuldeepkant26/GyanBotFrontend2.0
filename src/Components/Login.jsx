import React, { useContext, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import '../css/login.css'
import { toast } from 'react-toastify';
import { MyContext } from '../Context/MyProvider';

function Login() {
    const { setcurrUser } = useContext(MyContext);
    const navigate = useNavigate()
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    const [updating, setUpdating] = useState(false)
    const [showPass, setShowPass] = useState(false);

    //function to empty the form
    function emptyform() {
        setEmail('')
        setPassword('')
    }

    async function handelSubmit(e) {
        e.preventDefault();
        try {
            if (updating) {
                return toast.warn('Please wait')
            }
            setUpdating(true)
            toast.loading("Logging in, please wait...");
            const res = await axios.post(`${import.meta.env.VITE_BURL}/auth/login`, {
                email, password
            })
            console.log(res.data);
            localStorage.setItem('gyanbot-auth-token', res.data.token)
            setcurrUser(res.data.user);
            toast.dismiss();
            toast.success(res.data.message);
            setUpdating(false);
            emptyform()
            navigate('/')

        } catch (error) {
            toast.dismiss();
            setUpdating(false);
            toast.error(error.response.data.message)
            // console.log(error)
        }
    }
    return (
        <div className='signup-page'>
            <img src="https://i.pinimg.com/originals/e5/d6/8b/e5d68b4c0923839b89fefb727afb9742.gif" alt="" />
            <form className="sform" onSubmit={handelSubmit}>
                <div className="top">
                    <h1>Welcome back!</h1>
                </div>
                <input required type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='user-email' />
                <span className=''>
                    <input
                        required
                        type={showPass ? 'text' : 'password'}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />

                    {showPass ? <i className="ri-eye-fill" onClick={() => setShowPass(!showPass)}></i> : <i className="ri-eye-off-fill" onClick={() => setShowPass(!showPass)}></i>}

                </span>
                <button className='btn lbtn' type='submit'>Login</button>
                <p onClick={() => navigate('/signup')}>New user?</p>
            </form>
        </div>
    )
}

export default Login
