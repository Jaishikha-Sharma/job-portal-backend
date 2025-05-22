import React, { useEffect, useState } from 'react';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Try setting a test cookie
    document.cookie = "test_cookie=1; SameSite=None; Secure";

    // Wait a tick and then check if it was set
    setTimeout(() => {
      const cookiesEnabled = document.cookie.includes("test_cookie");
      if (!cookiesEnabled) {
        setShowBanner(true);
      }

      // Clean up the test cookie
      document.cookie = "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
    }, 100);
  }, []);

  const handleAccept = () => {
    setShowBanner(false);
    console.log("User acknowledged cookie issue.");
  };

  if (!showBanner) return null;

  return (
    <div style={bannerStyle}>
      <p>
        It looks like third-party cookies are disabled in your browser. Some features like social login or personalization may not work.
        Please enable third-party cookies for full functionality.
      </p>
      <button onClick={handleAccept}>Got it</button>
    </div>
  );
};

const bannerStyle = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: '#222',
  color: '#fff',
  padding: '1em',
  textAlign: 'center',
  zIndex: 1000,
};

export default CookieConsentBanner;
