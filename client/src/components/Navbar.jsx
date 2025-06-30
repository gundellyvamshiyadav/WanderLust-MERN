import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext'; 

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    
    const { curUser, logout } = useAuth();
    const navigate = useNavigate();
    const { addNotification } = useNotification(); 

    useEffect(() => {
        document.body.className = '';
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/listings?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    const handleLogoutClick = async () => {
        try {
            await logout();
            addNotification('You have been logged out.', 'success'); 
            navigate('/');
        } catch (error) {
            addNotification('Logout failed. Please try again.', 'error');
        }
    };

    return (
        <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/listings"><i className="fa-regular fa-compass"></i></Link>
                <div className="title d-none d-md-flex"><h3>WanderLust</h3></div>
                <Link className="navbar-brand-mobile d-md-none" to="/listings">WanderLust</Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                    <span className="toggler-bar"></span>
                    <span className="toggler-bar"></span>
                    <span className="toggler-bar"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link" to="/listings">Explore</NavLink>
                    </div>

                    <div className="navbar-nav mx-auto">
                        <div className="search-bar"> 
                            <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                                <input 
                                    className="form-control search-input" 
                                    type="search" 
                                    placeholder="Search destination"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="btn search-btn" type="submit">
                                    <i className="fa-solid fa-magnifying-glass"></i> Search
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="navbar-nav ms-auto d-flex align-items-center">
                        <NavLink className="nav-link" to="/listings/new">Add Your home</NavLink>
                        
                        {curUser ? (
                            <>
                                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>

                                <div className="theme-toggle">
                                    <input 
                                        type="checkbox" 
                                        className="checkbox"
                                        id="theme-toggle"
                                        checked={theme === 'dark'}
                                        onChange={handleThemeToggle}
                                    />
                                    <label htmlFor="theme-toggle" className="checkbox-label">
                                        <span className="ball">
                                            <img src="/images/moon.png" alt="dark mode" className="moon-icon" />
                                            <img src="/images/sun.png" alt="light mode" className="sun-icon" />
                                        </span>
                                    </label>
                                </div>
                                
                                <button className="nav-link btn btn-link" onClick={handleLogoutClick}><b>Logout</b></button>
                            </>
                        ) : (
                            <>
                                <NavLink className="nav-link" to="/signup"><b>Signup</b></NavLink>
                                <NavLink className="nav-link" to="/login"><b>Login</b></NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;