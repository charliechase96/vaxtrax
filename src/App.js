import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Home from './Components/User/Home';
import PetProfile from './Components/Pet/PetProfile';
import { useState, createContext } from 'react';

export const UserContext = createContext(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  function handleSuccess(data) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('refresh_token', data.refresh_token)

    setUserId(data.user_id);
    setIsAuthenticated(true);
  }

  function checkAuthentication() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return Promise.resolve(false);
    }

    return fetch('https://api.vaxtrax.pet/verify_token', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.ok)
    .catch(() => false);
  }

  return (
    <UserContext.Provider value={{ userId, checkAuthentication }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleSuccess}/>} />
          <Route path="/signup" element={<Signup onSignupSuccess={handleSuccess} />} />
          <Route path={`/:userId/home`} element={isAuthenticated ? <Home /> : <Login />} />
          <Route path={`/:userId/home/:petId/pet-profile`} element={isAuthenticated ? <PetProfile /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
