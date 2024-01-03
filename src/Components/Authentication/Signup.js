import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login';
import Footer from '../Footer/Footer';


function Signup({onSignupSuccess}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');

    function handleSignup(event) {
        event.preventDefault();
        fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Network response was not okay.');
        })
        .then(data => {
            onSignupSuccess(data);
            navigate('/home');
        })
        .catch(error => {
            setError('Failed to signup')
            console.log(error)});
    };

    return (
        <>
            <div>
                <h1>Welcome to VaxTrax!</h1>
                <form onSubmit={handleSignup}>
                    <h3>Login with Email and Password</h3>
                    <label>Username</label>
                    <input 
                        type="email" 
                        placeholder="Enter email" 
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required 
                    />
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required 
                    />
                    <button 
                        type="submit"
                        disabled={!email || !password}
                    >
                        Sign Up
                    </button>
                </form>
                <br/>
                <Link 
                    to="/" 
                    element={<Login />}
                >
                    Already have an account? Log in!
                </Link>
                {error && <div>{error}</div>}
            </div>
            <Footer />
        </>
    )
}

export default Signup;