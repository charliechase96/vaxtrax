import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Home from './Components/User/Home';
import PetProfile from './Components/Pet/PetProfile';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  function handleSuccess(data) {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('refresh_token', data.refresh_token)

    setUserId(data.user_id);
    setIsAuthenticated(true);
  }

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
