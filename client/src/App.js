import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthContainer from './components/Auth/AuthContainer';
import TurkeyMap from './components/Map/TurkeyMap';
import CityDetails from './components/Map/CityDetails';
import DeliveryPoints from './components/Map/DeliveryPoints';
import Splash from './components/Splash/Splash';
import Home from './components/Home/Home';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <Splash onFinish={handleSplashFinish} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<TurkeyMap />} />
          <Route path="/city-details/:city" element={<CityDetails />} />
          <Route path="/delivery-points/:city" element={<DeliveryPoints />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
