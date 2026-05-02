import React, { useEffect, useRef, useState } from 'react';

// reCAPTCHA Widget Component
const RecaptchaWidget = ({ onTokenChange, onExpired, reset }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const recaptchaRef = useRef();

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Reset reCAPTCHA when reset prop changes
  useEffect(() => {
    if (reset && isLoaded && window.grecaptcha && recaptchaRef.current) {
      window.grecaptcha.reset();
    }
  }, [reset, isLoaded]);

  // Handle reCAPTCHA callback
  useEffect(() => {
    if (isLoaded && window.grecaptcha) {
      window.recaptchaCallback = (token) => {
        if (onTokenChange) {
          onTokenChange(token);
        }
      };

      window.recaptchaExpiredCallback = () => {
        if (onExpired) {
          onExpired();
        }
      };
    }
  }, [isLoaded, onTokenChange, onExpired]);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey || siteKey === 'your_recaptcha_site_key_here') {
    return (
      <div style={{ color: 'orange', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
        <strong>reCAPTCHA Site Key Required</strong><br />
        Please set VITE_RECAPTCHA_SITE_KEY in your .env file
      </div>
    );
  }

  return (
    <div className="recaptcha-container">
      <div
        ref={recaptchaRef}
        className="g-recaptcha"
        data-sitekey={siteKey}
        data-callback="recaptchaCallback"
        data-expired-callback="recaptchaExpiredCallback"
        data-theme="light"
        data-size="normal"
      />
      
      <style jsx>{`
        .recaptcha-container {
          margin: 20px 0;
        }
        
        .g-recaptcha {
          display: inline-block;
        }
        
        @media (max-width: 480px) {
          .g-recaptcha {
            transform: scale(0.9);
            transform-origin: 0 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RecaptchaWidget;
