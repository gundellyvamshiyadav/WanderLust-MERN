import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import AuthLayout from '../components/AuthLayout';
import apiClient from '../api';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); 
    const { addNotification } = useNotification();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const data = await apiClient('/users/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            login(data.user);
            addNotification(data.message || 'Logged in successfully!', 'success');
            
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true }); 

        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back!"
            subtitle="Log in to continue your journey."
            switchText="Don't have an account?"
            switchLink="/signup"
            switchLinkText="Sign Up"
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
                        value={credentials.username}
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
                            value={credentials.password}
                            onChange={handleChange} 
                            required 
                        />
                        <span className="input-group-text bg-white" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(prev => !prev)}>
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                    </div>
                </div>
                
                <button type="submit" className="btn auth-btn w-100 mt-2" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging In...' : 'Log In'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;