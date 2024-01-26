import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Home from './Components/User/Home';
import PetProfile from './Components/Pet/PetProfile';
import { checkAuthentication } from './Utilities/auth';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  function handleSuccess(data) {
    localStorage.setItem('authToken', data.access_token);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('refresh_token', data.refresh_token)

    setUserId(data.user_id);
    setIsAuthenticated(true);
  }

  useEffect(() => {
    checkAuthentication()
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleSuccess}/>} />
        <Route path="/signup" element={<Signup onSignupSuccess={handleSuccess} />} />
        <Route path={`/:userId/home`} element={isAuthenticated ? <Home /> : <Login />} />
        <Route path={`/:userId/home/:petId/pet-profile`} element={isAuthenticated ? <PetProfile /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
