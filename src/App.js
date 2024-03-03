import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Home from './Components/User/Home';
import PetProfile from './Components/Pet/PetProfile';
import { useState, createContext, useEffect } from 'react';

export const UserContext = createContext(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || null);

  useEffect(() => {
    function handleStorageChange() {
      const storedUserId = localStorage.getItem("user_id");
      if (storedUserId !== userId) {
        setUserId(storedUserId);
      }
    };

    window.removeEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userId]);

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

  function refreshAccessToken() {
    return fetch('https://api.vaxtrax.pet/token_refresh', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }
        return response.json();
    })
    .then(data => {
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            return data.access_token;
        } else {
            throw new Error('No access token returned');
        }
    });
  }

  function fetchWithToken(url, options) {
    const accessToken = localStorage.getItem('access_token');

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.status === 401) {
            return refreshAccessToken().then(newAccessToken => {
                return fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${newAccessToken}`,
                    },
                });
            });
        }
        return response;
    });
  }

  return (
    <UserContext.Provider value={{ userId, setIsAuthenticated, setUserId, checkAuthentication, fetchWithToken }}>
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
