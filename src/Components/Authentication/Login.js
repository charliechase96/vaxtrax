import React, { useContext, useState, useEffect }from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Footer from '../Footer/Footer';
import { UserContext } from '../../App';

function Login({onLoginSuccess}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { setUserId, userId, setIsAuthenticated, refreshAccessToken } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
    
        if (!accessToken) {
          // if no access token, user is not logged in
          setIsAuthenticated(false);
          return;
        }

        fetch('https://api.vaxtrax.pet/verify_token', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
                setIsAuthenticated(true);
            }
            else {
                //token invalid; try refreshing it
                return refreshAccessToken()
            }
          })
          .then(success => {
            if (!success) {
                setIsAuthenticated(false);
                localStorage.removeItem('access_token');
                navigate('/');
            }
          })
        .catch(error => {
            console.error('Error verifying token', error);
            setIsAuthenticated(false);
            navigate('/');
        });
    }, [navigate, setIsAuthenticated, refreshAccessToken]);

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
                // Update authentication state after successful login
                setIsAuthenticated(true);
                // Set userId state to that of authenticated user id
                setUserId(data.user_id)
                // Navigate to authenticated user home page based on user id
                navigate(`/${userId}/home`);
            } else {
                setError('Failed to authenticate user');
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