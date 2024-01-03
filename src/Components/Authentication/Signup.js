import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import Login from './Login';
import Footer from '../Footer/Footer';


function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSignup() {
        console.log("Signup successful!");
    }

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
            </div>
            <Footer />
        </>
    )
}

export default Signup;