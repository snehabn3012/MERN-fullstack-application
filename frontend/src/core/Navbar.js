import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    useIsAdmin,
    useIsRegisteredUser,
    useIsAuthenticated,
    useUserData,
} from '../hooks/useAuth';
import { signout } from '../auth';
import { ThemeToggle } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const isAdmin = useIsAdmin();
    const isUser = useIsRegisteredUser();
    const isAuthenticated = useIsAuthenticated();
    const { user } = useUserData() || {};
    const _id = user?._id;
    const toast = useToast();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        setDropdownOpen(false);
        try {
            await signout(() => {});
            toast.success('You have been signed out. See you soon! 👋');
            navigate('/');
        } catch {
            toast.error('Sign-out failed. Please try again.');
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <Link to="/">
                        <span className="logo-leaf">🌿</span> FreshRoot
                    </Link>
                </div>

                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">All Products</Link></li>
                    <li><Link to="/cart">Cart</Link></li>

                    {isUser && (
                        <li>
                            <Link to="/user/dashboard">My Dashboard</Link>
                        </li>
                    )}

                    {isAdmin && (
                         <li>
                        <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)}>
                            Admin Dashboard
                        </Link>
                        </li>
                    )}

                    <li className="dropdown" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(o => !o)}
                            className="dropdown-btn"
                            aria-expanded={dropdownOpen}
                            aria-haspopup="true"
                        >
                         More
                        </button>

                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/user/dashboard"> My Account</Link>
                                <Link to={`/profile/${_id}`} onClick={() => setDropdownOpen(false)}>
                                    My Profile
                                </Link>
                                <Link to="/purchase-history" onClick={() => setDropdownOpen(false)}>
                                    Order History
                                </Link>

                                {isAuthenticated ? (
                                    <span
                                        className="dropdown-item"
                                        onClick={handleLogout}
                                        style={{ opacity: loggingOut ? 0.6 : 1, pointerEvents: loggingOut ? 'none' : 'auto' }}
                                    >
                                        {loggingOut ? 'Signing out…' : 'Sign Out'}
                                    </span>
                                ) : (
                                    <>
                                        <Link to="/signin" onClick={() => setDropdownOpen(false)}>Sign In</Link>
                                        <Link to="/signup" onClick={() => setDropdownOpen(false)}>Create Account</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </li>
                </ul>

                <div className="navbar-right" style={{ display: 'flex', alignItems: 'center' }}>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
