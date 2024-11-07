import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../css/nav.css';
import { MyContext } from '../Context/MyProvider';
import ProfileEdit from './ProfileEdit';
import UserInfoEdit from './UserInfoEdit';

function Nav() {
    const { currUser, logout } = useContext(MyContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    function handelLogout() {
        logout();
    }

    return (
        <>
            <nav>
                <h3>GYANBOT</h3>
                <div className={`menu ${menuOpen ? 'slidemenu' : ''}`}>
                    <i
                        id="mnuclose"
                        className={`ri-arrow-right-line ${menuOpen ? '' : 'rotate180'}`}
                        onClick={toggleMenu}
                    ></i>

                    {/* Conditionally render "Home" link if not on the home route */}
                    {location.pathname !== '/' && (
                        <Link className="options" to="/" onClick={closeMenu}>
                            Home
                        </Link>
                    )}

                    <Link className="options" to="/allposts" onClick={closeMenu}>
                        Explore
                    </Link>

                    {localStorage.getItem('gyanbot-auth-token') && currUser ? (
                        <>
                            <button
                                className="options"
                                onClick={() => {
                                    toggleMenu();
                                    handelLogout();
                                    navigate('/');
                                }}
                            >
                                Logout
                            </button>
                            <Link
                                className="options"
                                to={`/profile/${currUser._id}`}
                                onClick={toggleMenu}
                            >
                                {currUser.profilePicture ? (
                                    <img
                                        className="user-profile-pic m-auto object-cover"
                                        src={currUser.profilePicture}
                                        alt="Profile"
                                    />
                                ) : (
                                    <p className="profile-button">{currUser.name[0]}</p>
                                )}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link className="options" to="/signup" onClick={toggleMenu}>
                                Signup
                            </Link>
                            <Link className="options" to="/login" onClick={toggleMenu}>
                                Login
                            </Link>
                        </>
                    )}
                </div>

                <i id="mnubtn" className="ri-menu-line" onClick={toggleMenu}></i>
            </nav>

            <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
            <ProfileEdit />
            <UserInfoEdit />
        </>
    );
}

export default Nav;
