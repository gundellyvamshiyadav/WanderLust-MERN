// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import AuthLayout from '../components/AuthLayout';

const SignupPage = () => {
    // --- React Hooks & State ---
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from our context
    const { addNotification } = useNotification(); // Get the notification function
    
    // State for the form fields
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    // State to manage password visibility
    const [showPassword, setShowPassword] = useState(false);
    // State for displaying form-specific errors
    const [error, setError] = useState('');
    // State to disable the button during submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- Event Handlers ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Ensure your server route is /api/users/signup as configured in app.js
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed. Please try again.');
            }
            
            login(data.user);
            addNotification(data.message || "Welcome to Wanderlust!", 'success');
            navigate('/');
            
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <AuthLayout
            title="Create Your Account"
            subtitle="Join Wanderlust to discover your next adventure."
            switchText="Already have an account?"
            switchLink="/login"
            switchLinkText="Log In"
        >
            <form onSubmit={handleSubmit} noValidate>
                {error && <div className="alert alert-danger p-2 mb-3">{error}</div>}
                
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                        type="text" 
                        name="username" 
                        id="username" 
                        className="form-control" 
                        value={formData.username}
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        className="form-control" 
                        value={formData.email}
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            id="password" 
                            className="form-control" 
                            value={formData.password}
                            onChange={handleChange} 
                            required 
                        />
                        <span className="input-group-text bg-white" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(prev => !prev)}>
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} id="eyeIcon"></i>
                        </span>
                    </div>
                </div>
                
                <button type="submit" className="btn auth-btn w-100 mt-2" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default SignupPage;