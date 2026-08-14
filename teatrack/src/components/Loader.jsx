import React, { useState, useEffect } from 'react';
import './Loader.css';
import chaiVideo from '../assets/Pouring_masala_chai_into_kulhad_202608121811.mp4';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds loading time
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (nextProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 200); // Brief pause at 100 before calling onComplete
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loader-container ${progress === 100 ? 'fade-out' : ''}`}>
      <div className="loader-progress">{progress}</div>
      <div className="loader-video-wrapper">
        <video 
          src={chaiVideo} 
          autoPlay 
          muted 
          loop 
          playsInline
          className="loader-video"
        />
      </div>
      <div className="loader-text">
        શું કરે છે?<br/>ચાની એન્ટ્રી પાડ
      </div>
    </div>
  );
}
