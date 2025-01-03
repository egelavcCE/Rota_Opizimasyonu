import React, { useEffect, useState } from 'react';
import './Splash.css';

const Splash = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="logo-container">
        <h1 className="logo-text">NAVIONIX</h1>
        <div className="route-container">
          <svg viewBox="0 0 1000 400" className="route-svg">
            <path
              d="M50,300 C150,300 150,200 250,200 S450,100 550,100 S750,200 850,100 S950,50 950,50"
              className="route-path"
            />
            <circle className="marker start-marker" r="8" cx="50" cy="300">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle className="marker end-marker" r="8" cx="950" cy="50">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
                begin="1s"
              />
            </circle>
            <circle className="moving-dot" r="6" cx="50" cy="300">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path="M50,300 C150,300 150,200 250,200 S450,100 550,100 S750,200 850,100 S950,50 950,50"
              />
            </circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Splash; 