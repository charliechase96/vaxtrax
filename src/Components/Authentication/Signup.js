import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login';
import Footer from '../Footer/Footer';
import { UserContext } from '../../App';


function Signup({onSignupSuccess}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');

    const { checkAuthentication } = useContext(UserContext);

    const navigate = useNavigate();

    function handleSignup(event) {
        event.preventDefault();
        fetch('https://api.vaxtrax.pet/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
            if (data.access_token) {
                //access token is present, indicating a successful signup
                //pass user_id to onSignupSuccess if provided
                if (onSignupSuccess) {
                    onSignupSuccess(data.access_token, data.userId);
                }
                checkAuthentication().then(authenticated => {
                    if (authenticated) {
                        navigate(`/${data.userId}/home`);
                    }
                    else {
                        setError('Failed to signup');
                    }
                });
            } else {
                setError('Failed to signup');
            }
        })
        .catch(error => {
            setError('Failed to signup')
            console.log(error)});
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