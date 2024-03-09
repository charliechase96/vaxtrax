import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login';
import Footer from '../Footer/Footer';
import { UserContext } from '../../App';


function Signup({onSignupSuccess}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');

    const { setUserId, userId, setIsAuthenticated, refreshAccessToken } = useContext(UserContext);

    const navigate = useNavigate();

    // useEffect(() => {
    //     const accessToken = localStorage.getItem('access_token');
    //     if (!accessToken) {
    //         setIsAuthenticated(false);
    //         return; // Exit if no token is found
    //     }

    //     // Verify the existing access token
    //     fetch('https://api.vaxtrax.pet/verify_token', {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`,
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then(response => {
    //         if (response.ok) {
    //             setIsAuthenticated(true); // Redirect to home if already authenticated
    //         } else {
    //             return refreshAccessToken(); // Try refreshing token if verification fails
    //         }
    //     })
    //     .then(success => {
    //         if (!success) {
    //             setIsAuthenticated(false);
    //             localStorage.removeItem('access_token');
    //             navigate('/');
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error verifying token:', error);
    //         setIsAuthenticated(false);
    //         navigate('/');
    //     });
    // }, [navigate, setIsAuthenticated, refreshAccessToken]);

    function handleSignup(event) {
        event.preventDefault();
        fetch('https://api.vaxtrax.pet/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                //access token is present, indicating a successful signup
                //call onSignupSuccess (handleSuccess) to set access token, user id, refresh token
                onSignupSuccess(data);
                //on successful signup, set authentication to true
                setIsAuthenticated(true);
                //set userId state using authenticated data from response
                setUserId(data.user_id)
                //on successful signup, navigate to homepage of user whose id matches authentication/state
                navigate(`/${userId}/home`);
            } else {
                setError('Failed to signup');
            }
        })
        .catch(error => {
            setError('Failed to signup')
            console.error("Error during fetch: ", error)});
    };

    return (
        <div className='signup-container'>
            <div className='signup-form'>
                <h1>Welcome to VaxTrax!</h1>
                <form onSubmit={handleSignup}>
                    <h3>Signup with Email and Password</h3>
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
        </div>
    )
}

export default Signup;