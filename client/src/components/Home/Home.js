import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="map-header">
        <div className="header-logo">NAVIONIX</div>
      </header>

      <main className="home-content">
        <section className="hero-section">
          <h1 className="hero-title">Akıllı Rota Optimizasyonu</h1>
          <p className="hero-subtitle">Yapay zeka destekli rota planlama ile zamandan ve yakıttan tasarruf edin</p>
          <button className="start-button" onClick={handleStartPlanning}>
            Rotanı Planlamaya Başla
          </button>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon map-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13V7m0 0L9 4" />
              </svg>
            </div>
            <h3>Haritadan İl Seç</h3>
            <p>Türkiye haritası üzerinden teslimat yapılacak ili seçin</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon point-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3>Noktaları İşaretle</h3>
            <p>Başlangıç noktası ve teslimat adreslerini belirleyin</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon route-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13V7m0 0L9 4" />
              </svg>
            </div>
            <h3>Yapay Zeka Rotanı Çizsin</h3>
            <p>Optimum rotanızı yapay zeka teknolojimiz belirlesin</p>
          </div>
        </section>

        <section className="benefits-section">
          <div className="benefit-item">
            <h4>%30</h4>
            <p>Yakıt Tasarrufu</p>
          </div>
          <div className="benefit-item">
            <h4>%40</h4>
            <p>Zaman Tasarrufu</p>
          </div>
          <div className="benefit-item">
            <h4>%25</h4>
            <p>Maliyet Azalması</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 