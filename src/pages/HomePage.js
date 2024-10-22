import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from "react-router-dom"; // For redirecting
import { jwtDecode } from "jwt-decode";

import LandingPageAnimation from '../assets/LandingPageAnimation.json';
import api from "../utils/api"; // Axios instance with JWT handling

const HomePage = () => {
    const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook to navigate to a different page

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = Date.now() >= decodedToken.exp * 1000;
        if (isTokenExpired) {
            localStorage.removeItem("token");
        } else {
            navigate("/dashboard");
        }
    }

    // Effect to clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000); // 5 seconds timeout

            // Cleanup the timer when component unmounts or error changes
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { email, password };
            if (!isLogin) payload.username = username;

            // Error handling (Extra layer)
            if (isLogin && (!email || !password)) {
                setError("Email and password are required");
                return;
            } else if (!isLogin && (!email || !password || !username)) {
                setError("All fields are required");
                return;
            }

            // Make a POST request to the server
            const url = isLogin ? "/auth/login" : "/auth/register";
            const res = await api.post(url, payload);

            // Save the token and user data in local storage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Redirect to the dashboard
            navigate("/dashboard");
        } catch (err) {
            let message = err.response?.data?.message || "An error occurred";
            // If the error is a validation error, extract the error message (this happens when the error comes directly from the User model)
            if (message === "Validation error") {
                message = err.response.data.errors.map((e) => e.msg).join("\n");
            }

            // Display the error message
            setError(message);
            console.error('An error occurred:', err);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-r from-teal-500 via-indigo-500 to-violet-950 flex flex-col items-center justify-center'>
            
            {/* Pop-up Error Notification */}
            <div 
                className={`fixed top-0 left-0 right-0 bg-red-500 text-white py-4 px-6 z-50 
                    transition-transform duration-500 ease-in-out transform ${error ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="container mx-auto flex justify-center items-center">
                    <p>{error}</p>
                </div>
            </div>
            
            {/* Website Title */}
            <div className='text-center text-gray-200 p-4'>
                <h1 className='text-4xl font-bold mt-8 mb-4 text-teal-200'>Smart Personal Diary</h1>
                <h3 className='text-xl mb-4'>
                    A simple and secure way to keep your thoughts and ideas organized, gain AI-driven insights, and track your mood!
                </h3>
            </div>
            
            {/* Main Content */}
            <div className='grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl gap-8 p-4'>
                
                {/* Left Side (Lottie Animation) */}
                <div className='flex justify-center items-center'>
                    <Lottie animationData={LandingPageAnimation} loop={true} className='w-full h-full'/>
                </div>

                {/* Right Side (Login/Register Form) */}
                <div className='flex justify-center items-center'>
                    <div className='p-8 rounded-lg shadow-lg w-full max-w-md min-h-[400px] flex flex-col justify-center border-2 border-teal-900'>
                        <h2 className='text-2xl font-bold mb-4 text-teal-200 flex items-center justify-center'>
                            {isLogin ? 'Login' : 'Register'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <input
                                    type='text'
                                    className='w-full p-2 mb-4 border border-teal-500 rounded bg-gray-300 placeholder-opacity-25 focus:outline-none focus:border-violet-800'
                                    placeholder='Username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            )}
                            <input
                                type='email'
                                className='w-full p-2 mb-4 border border-teal-500 rounded bg-gray-300 placeholder-opacity-25 focus:outline-none focus:border-violet-800'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type='password'
                                className='w-full p-2 mb-4 border border-teal-500 rounded bg-gray-300 placeholder-opacity-25 focus:outline-none focus:border-violet-800'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type='submit'
                                className='w-full p-2 bg-teal-600 text-white rounded hover:bg-teal-500 focus:outline-none'
                            >
                                {isLogin ? 'Login' : 'Register'}
                            </button>
                        </form>
                        <p className='mt-4 text-sm text-gray-300'>
                            {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
                            <button
                                onClick={toggleForm}
                                className='text-teal-300 hover:text-teal-200 hover:underline focus:outline-none'
                            >
                                {isLogin ? 'Register here' : 'Login here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='text-gray-300 text-center py-4'>
                <p>
                    Made with ❤️ by{' '}
                    <a
                        href='/'
                        className='text-teal-300 hover:text-teal-200 hover:underline focus:outline-none'
                    >
                        Full-Stack Forces
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
