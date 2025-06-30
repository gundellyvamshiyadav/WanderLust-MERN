import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const authImages = [
    "/images/auth-bg-1.jpg", 
    "/images/auth-bg-6.jpg",
    "/images/auth-bg-3.jpg",
    "/images/auth-bg-4.jpg",
    "/images/auth-bg-5.jpg"
];

const AuthLayout = ({ children, title, subtitle, switchText, switchLink, switchLinkText }) => {
    const imagePanelRef = useRef(null);

    // This hook replaces the DOMContentLoaded script for setting a random background
    useEffect(() => {
        const randomImage = authImages[Math.floor(Math.random() * authImages.length)];
        if (imagePanelRef.current) {
            imagePanelRef.current.style.backgroundImage = `url(${randomImage})`;
        }
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="auth-wrapper">
            <div className="card auth-card-split">
                <div className="row g-0">
                    <div 
                        className="col-lg-6 d-none d-lg-block auth-image-side" 
                        ref={imagePanelRef}
                    >
                    </div>
                    <div className="col-lg-6">
                        <div className="auth-form-side">
                            <h3>{title}</h3>
                            <p className="form-text">{subtitle}</p>
                            {children}

                            <div className="auth-switch-link">
                                <span>{switchText} <Link to={switchLink}>{switchLinkText}</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;