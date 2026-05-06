import React, { useEffect, useRef, useState, useCallback } from "react";

// Load the reCAPTCHA script once globally to avoid duplicate loads
const loadRecaptchaScript = (() => {
  let promise = null;
  return () => {
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        if (window.grecaptcha && window.grecaptcha.render) {
          resolve();
          return;
        }
        // Use explicit render mode to avoid auto-render issues
        const script = document.createElement("script");
        script.src =
          "https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoad";
        script.async = true;
        script.defer = true;
        window.onRecaptchaLoad = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load reCAPTCHA script"));
        document.head.appendChild(script);
      });
    }
    return promise;
  };
})();

// reCAPTCHA Widget Component
// widgetRef (optional): pass a React ref to receive the widgetId for programmatic grecaptcha.execute(widgetId)
const RecaptchaWidget = ({ onTokenChange, onExpired, reset, widgetRef }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Render the widget explicitly so a widgetId is always created
  const renderWidget = useCallback(() => {
    if (
      !containerRef.current ||
      !window.grecaptcha ||
      !window.grecaptcha.render
    )
      return;
    if (widgetIdRef.current !== null) return; // Already rendered

    try {
      const id = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          if (onTokenChange) onTokenChange(token);
        },
        "expired-callback": () => {
          widgetIdRef.current !== null &&
            window.grecaptcha.reset(widgetIdRef.current);
          if (onExpired) onExpired();
        },
        "error-callback": () => {
          if (onExpired) onExpired();
        },
        theme: "light",
        size: "normal",
      });

      widgetIdRef.current = id;

      // Expose widgetId via ref prop so parent can call grecaptcha.execute(widgetId)
      if (widgetRef) {
        widgetRef.current = id;
      }

      setIsReady(true);
    } catch (err) {
      console.error("reCAPTCHA render error:", err);
      setError("Failed to render reCAPTCHA widget.");
    }
  }, [siteKey, onTokenChange, onExpired, widgetRef]);

  // Load script then render
  useEffect(() => {
    if (!siteKey || siteKey === "your_recaptcha_site_key_here") return;

    loadRecaptchaScript()
      .then(() => renderWidget())
      .catch((err) => {
        console.error("reCAPTCHA load error:", err);
        setError("Failed to load reCAPTCHA. Please check your connection.");
      });
  }, [renderWidget, siteKey]);

  // Reset widget when reset prop changes
  useEffect(() => {
    if (reset && widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  }, [reset]);

  if (!siteKey || siteKey === "your_recaptcha_site_key_here") {
    return (
      <div
        style={{
          color: "orange",
          padding: "10px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
        }}
      >
        <strong>reCAPTCHA Site Key Required</strong>
        <br />
        Please set VITE_RECAPTCHA_SITE_KEY in your .env file
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          color: "#dc3545",
          padding: "10px",
          backgroundColor: "#f8d7da",
          border: "1px solid #f5c6cb",
          borderRadius: "4px",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ margin: "20px 0" }}>
      {!isReady && (
        <div
          style={{ color: "#6c757d", fontSize: "14px", marginBottom: "8px" }}
        >
          Loading reCAPTCHA...
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
};

export default RecaptchaWidget;
