import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

const AuthContainer = ({ children, onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegisterPage) {
      if (formData.password !== formData.confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return;
      }
      // Burada gerçek kayıt işlemi yapılacak
      console.log('Kayıt yapılıyor:', formData);
      navigate('/');
    } else {
      // Burada gerçek giriş işlemi yapılacak
      console.log('Giriş yapılıyor:', formData);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-toggle">
        </div>
        {React.cloneElement(children, { formData, handleInputChange, handleSubmit })}
      </div>
    </div>
  );
};

export default AuthContainer; 