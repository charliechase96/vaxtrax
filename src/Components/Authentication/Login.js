import React, { useState }from 'react';
import { Link } from 'react-router-dom';
import Signup from './Signup';
import Footer from '../Footer/Footer';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin() {
        console.log("Login successful!")
    }

    return (
        <>
            <div>
                <h1>Welcome to VaxTrax!</h1>
                <form onSubmit={handleLogin}>
                    <h3>Login with Email and Password</h3>
                    <label>Username</label>
                    <input 
                        type="email" 
                        placeholder="Enter username" 
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required 
                    />
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
            </div>
            <Footer />
        </>
    )
}

export default Login;