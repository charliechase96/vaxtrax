import React, { useContext, useState }from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Footer from '../Footer/Footer';
import { UserContext } from '../../App';

function Login({onLoginSuccess}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { checkAuthentication, setUserId, userId } = useContext(UserContext);

    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();
        fetch('https://api.vaxtrax.pet/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                // Access token is present, indicating a successful login
                onLoginSuccess(data);
                setUserId(data.user_id)
                // Call checkAuthentication here
                checkAuthentication().then(authenticated => {
                    if (authenticated) {
                       navigate(`/${userId}/home`); 
                    }
                    else {
                        setError('Authentication failed');
                    }
                });
            } else {
                setError('Failed to login');
            }
        })
        .catch(error => {
            setError('Failed to login');
            console.error("Error during fetch: ", error);
        });
    }

    return (
        <div className='login-container'>
            <div className='login-form'>
                <h1>Welcome to VaxTrax!</h1>
                <form onSubmit={handleLogin}>
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
                        Login
                    </button>
                </form>
                <br/>
                <Link 
                    to="/signup" 
                    element={<Signup />}
                >
                    New user? Create an account!
                </Link>
                {error && <div>{error}</div>}
            </div>
            <Footer />
        </div>
    )
}

export default Login;