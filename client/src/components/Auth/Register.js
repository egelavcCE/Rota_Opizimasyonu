import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Registration successful, navigate to login
      navigate('/login');
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Bu e-posta adresi zaten kullanımda');
          break;
        case 'auth/invalid-email':
          setError('Geçersiz e-posta adresi');
          break;
        case 'auth/weak-password':
          setError('Şifre en az 6 karakter olmalıdır');
          break;
        default:
          setError('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header-main">
        <div className="auth-logo-main">NAVIONIX</div>
        <div className="auth-nav-buttons">
          <button 
            className="auth-nav-button login" 
            onClick={() => navigate('/login')}
          >
            Giriş Yap
          </button>
          <button 
            className="auth-nav-button register" 
            onClick={() => navigate('/register')}
          >
            Üye Ol
          </button>
        </div>
      </div>
      
      <div className="auth-box">
        <div className="route-decoration">
          <div className="route-line"></div>
          <div className="route-dot"></div>
        </div>
        
        <div className="auth-form-container">
          <h2 className="auth-title">Üye Ol</h2>
          <p className="auth-subtitle">Hemen hesap oluşturun</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Ad Soyad"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="E-posta"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Şifre Tekrar"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button" 
              disabled={loading}
            >
              {loading ? 'Kayıt Yapılıyor...' : 'Üye Ol'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              Zaten hesabınız var mı? Giriş yapın
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 