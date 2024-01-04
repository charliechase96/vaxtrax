import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Home from './Components/User/Home';
import PetProfile from './Components/Pet/PetProfile';

function App() {

  function handleSuccess(token) {
    localStorage.setItem('authToken', token);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleSuccess}/>} />
        <Route path="/signup" element={<Signup onSignupSuccess={handleSuccess} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/pet-profile" element={<PetProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
