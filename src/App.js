import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import UserProfile from './Components/User/UserProfile';

function App() {

  function handleSuccess(token) {
    localStorage.setItem('authToken', token);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleSuccess}/>} />
        <Route path="/signup" element={<Signup onSignupSuccess={handleSuccess} />} />
        <Route path="/home" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
