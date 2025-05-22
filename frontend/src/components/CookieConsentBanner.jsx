import React, { useEffect, useState } from 'react';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    checkCookieSupport();
  }, []);

  const checkCookieSupport = () => {
    try {
      // Try setting a test cookie
      document.cookie = "test_cookie=1; SameSite=None; Secure";
      
      // Wait a tick and then check if it was set
      setTimeout(() => {
        const cookiesEnabled = document.cookie.includes("test_cookie");
        setShowBanner(!cookiesEnabled);

        // Clean up the test cookie
        document.cookie = "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
      }, 100);
    } catch (e) {
      setShowBanner(true);
    }
  };

  const handleAccept = () => {
    window.location.reload();
  };

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) {
      return (
        <ol className="list-decimal ml-6 mt-2">
          <li>Click the three dots menu (⋮) in the top-right corner</li>
          <li>Click "Settings"</li>
          <li>Scroll down and click "Privacy and security"</li>
          <li>Click "Cookies and other site data"</li>
          <li>Enable "Allow all cookies" or add this site to the exceptions</li>
        </ol>
      );
    } else if (userAgent.includes('firefox')) {
      return (
        <ol className="list-decimal ml-6 mt-2">
          <li>Click the menu button (≡) in the top-right corner</li>
          <li>Click "Settings"</li>
          <li>Click "Privacy & Security"</li>
          <li>Under "Enhanced Tracking Protection", select "Standard" or add an exception for this site</li>
        </ol>
      );
    } else if (userAgent.includes('safari')) {
      return (
        <ol className="list-decimal ml-6 mt-2">
          <li>Click "Safari" in the top menu</li>
          <li>Click "Preferences"</li>
          <li>Go to the "Privacy" tab</li>
          <li>Uncheck "Prevent cross-site tracking" or adjust cookie settings</li>
        </ol>
      );
    }
    return (
      <p className="mt-2">
        Please check your browser's settings and enable third-party cookies or add this site to your exceptions list.
      </p>
    );
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Cookies Required</h3>
              <p className="text-gray-300">
                This site requires cookies to function properly. Please enable third-party cookies in your browser settings to access all features.
              </p>
            </div>
            <div className="flex flex-col space-y-2 md:ml-4 mt-4 md:mt-0">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
              </button>
              <button
                onClick={handleAccept}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                I've Enabled Cookies
              </button>
            </div>
          </div>
          
          {showInstructions && (
            <div className="bg-gray-800 p-4 rounded-lg mt-2">
              <h4 className="font-bold mb-2">How to Enable Cookies:</h4>
              {getBrowserInstructions()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
