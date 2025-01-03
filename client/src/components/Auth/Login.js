import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Login successful, navigate to map
      navigate('/map');
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('E-posta veya şifre hatalı');
          break;
        case 'auth/invalid-email':
          setError('Geçersiz e-posta adresi');
          break;
        case 'auth/too-many-requests':
          setError('Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.');
          break;
        default:
          setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
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
          <h2 className="auth-title">Hoş Geldiniz</h2>
          <p className="auth-subtitle">Hesabınıza giriş yapın</p>

          <form onSubmit={handleSubmit}>
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

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/register" className="auth-link">
              Hesabınız yok mu? Hemen üye olun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 