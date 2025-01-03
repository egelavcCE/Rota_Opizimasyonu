import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as TurkeyMapSVG } from '../../assets/tr.svg';
import './TurkeyMap.css';

// Türkiye'deki illerin plaka kodları ve isimleri
const cityNames = {
  'TR01': 'Adana', 'TR02': 'Adıyaman', 'TR03': 'Afyonkarahisar', 'TR04': 'Ağrı',
  'TR05': 'Amasya', 'TR06': 'Ankara', 'TR07': 'Antalya', 'TR08': 'Artvin',
  'TR09': 'Aydın', 'TR10': 'Balıkesir', 'TR11': 'Bilecik', 'TR12': 'Bingöl',
  'TR13': 'Bitlis', 'TR14': 'Bolu', 'TR15': 'Burdur', 'TR16': 'Bursa',
  'TR17': 'Çanakkale', 'TR18': 'Çankırı', 'TR19': 'Çorum', 'TR20': 'Denizli',
  'TR21': 'Diyarbakır', 'TR22': 'Edirne', 'TR23': 'Elazığ', 'TR24': 'Erzincan',
  'TR25': 'Erzurum', 'TR26': 'Eskişehir', 'TR27': 'Gaziantep', 'TR28': 'Giresun',
  'TR29': 'Gümüşhane', 'TR30': 'Hakkari', 'TR31': 'Hatay', 'TR32': 'Isparta',
  'TR33': 'Mersin', 'TR34': 'İstanbul', 'TR35': 'İzmir', 'TR36': 'Kars',
  'TR37': 'Kastamonu', 'TR38': 'Kayseri', 'TR39': 'Kırklareli', 'TR40': 'Kırşehir',
  'TR41': 'Kocaeli', 'TR42': 'Konya', 'TR43': 'Kütahya', 'TR44': 'Malatya',
  'TR45': 'Manisa', 'TR46': 'Kahramanmaraş', 'TR47': 'Mardin', 'TR48': 'Muğla',
  'TR49': 'Muş', 'TR50': 'Nevşehir', 'TR51': 'Niğde', 'TR52': 'Ordu',
  'TR53': 'Rize', 'TR54': 'Sakarya', 'TR55': 'Samsun', 'TR56': 'Siirt',
  'TR57': 'Sinop', 'TR58': 'Sivas', 'TR59': 'Tekirdağ', 'TR60': 'Tokat',
  'TR61': 'Trabzon', 'TR62': 'Tunceli', 'TR63': 'Şanlıurfa', 'TR64': 'Uşak',
  'TR65': 'Van', 'TR66': 'Yozgat', 'TR67': 'Zonguldak', 'TR68': 'Aksaray',
  'TR69': 'Bayburt', 'TR70': 'Karaman', 'TR71': 'Kırıkkale', 'TR72': 'Batman',
  'TR73': 'Şırnak', 'TR74': 'Bartın', 'TR75': 'Ardahan', 'TR76': 'Iğdır',
  'TR77': 'Yalova', 'TR78': 'Karabük', 'TR79': 'Kilis', 'TR80': 'Osmaniye',
  'TR81': 'Düzce'
};

const TurkeyMap = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const paths = document.querySelectorAll('.turkey-map svg path, .turkey-map svg circle');
    paths.forEach(path => {
      const cityId = path.getAttribute('id');
      const cityName = cityNames[cityId];
      if (cityName) {
        path.setAttribute('title', cityName);
      }
      
      path.addEventListener('mousemove', handleMouseMove);
      path.addEventListener('mouseleave', handleMouseLeave);
      path.addEventListener('click', handleCityClick);
    });

    return () => {
      paths.forEach(path => {
        path.removeEventListener('mousemove', handleMouseMove);
        path.removeEventListener('mouseleave', handleMouseLeave);
        path.removeEventListener('click', handleCityClick);
      });
    };
  }, []);

  const handleMouseMove = (e) => {
    const cityId = e.target.getAttribute('id');
    const cityName = cityNames[cityId];
    if (cityName) {
      setHoveredCity({
        name: cityName,
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCity(null);
  };

  const handleCityClick = (e) => {
    const cityId = e.target.getAttribute('id');
    const cityName = cityNames[cityId];
    
    if (cityName) {
      const paths = document.querySelectorAll('.turkey-map svg path, .turkey-map svg circle');
      paths.forEach(path => {
        path.classList.remove('selected');
      });
      
      e.target.classList.add('selected');
      setSelectedCity(cityName);
    }
  };

  const handleContinue = () => {
    if (selectedCity) {
      navigate(`/city-details/${selectedCity}`);
    }
  };

  return (
    <div className="map-page">
      <header className="map-header">
        <h1 className="map-title">NAVIONIX</h1>
      </header>
      
      <div className="map-container">
        <h2>Lütfen bir şehir seçiniz</h2>
        <div className="turkey-map" ref={mapRef}>
          <TurkeyMapSVG />
          {hoveredCity && (
            <div 
              className="tooltip"
              style={{
                left: hoveredCity.x - (mapRef.current?.offsetLeft || 0) + 10,
                top: hoveredCity.y - (mapRef.current?.offsetTop || 0) - 20
              }}
            >
              {hoveredCity.name}
            </div>
          )}
        </div>
        <div className="selected-city-container">
          {selectedCity && (
            <>
              <div className="selected-city">
                <p>Seçilen Şehir: {selectedCity}</p>
              </div>
              <button 
                className="continue-button"
                onClick={handleContinue}
              >
                Devam Et
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurkeyMap; 