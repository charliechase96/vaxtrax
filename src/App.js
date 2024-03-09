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
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || null);

  function handleSuccess(data) {
    setUserId(data.user_id);
    setIsAuthenticated(true);
  }

  return (
    <UserContext.Provider value={{ userId, setIsAuthenticated, setUserId }}>
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
