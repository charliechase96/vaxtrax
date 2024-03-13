import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login';
import Footer from '../Footer/Footer';
import { UserContext } from '../../App';


function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');

    const { userId, handleSuccess } = useContext(UserContext);

    const navigate = useNavigate();

    function handleSignup(event) {
        event.preventDefault();
        fetch('https://api.vaxtrax.pet/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Necessary for session cookies
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to signup');
            }
        })
        .then(data => {
            if (data.message === "User created and logged in successfully.") {
                //call onSignupSuccess (handleSuccess) to set userId state and isAuthenticated state
                handleSuccess({ user_id: data.user_id, isAuthenticated: true});
                //on successful signup, navigate to homepage of user whose id matches authentication/state
                navigate(`/${userId}/home`);
            } else {
                setError(data.message || 'Failed to signup');
            }
        })
        .catch(error => {
            setError(error.message)
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