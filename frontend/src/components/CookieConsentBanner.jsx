import React, { useEffect, useState } from 'react';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    checkCookieSupport();
  }, []);

  const checkCookieSupport = () => {
    try {
      // First try to set a regular cookie
      document.cookie = "test_cookie=1; path=/";
      
      // Then try to set a third-party cookie with SameSite=None
      document.cookie = "test_third_party_cookie=1; SameSite=None; Secure";
      
      // Wait a bit longer to ensure cookies are processed
      setTimeout(() => {
        // Check both cookies
        const regularCookieEnabled = document.cookie.includes("test_cookie");
        const thirdPartyCookieEnabled = document.cookie.includes("test_third_party_cookie");
        
        console.log('Cookie Check Results:', {
          regularCookieEnabled,
          thirdPartyCookieEnabled,
          allCookies: document.cookie
        });

        // Show banner if either cookie type is blocked
        setShowBanner(!regularCookieEnabled || !thirdPartyCookieEnabled);

        // Clean up test cookies
        document.cookie = "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = "test_third_party_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
      }, 500); // Increased timeout to ensure cookies are processed
    } catch (e) {
      console.error('Cookie check error:', e);
      setShowBanner(true);
    }
  };

  const handleAccept = () => {
    // Try to set cookies again before reloading
    try {
      document.cookie = "test_cookie=1; path=/";
      document.cookie = "test_third_party_cookie=1; SameSite=None; Secure";
      
      // Check if cookies were set successfully
      const regularCookieEnabled = document.cookie.includes("test_cookie");
      const thirdPartyCookieEnabled = document.cookie.includes("test_third_party_cookie");
      
      if (!regularCookieEnabled || !thirdPartyCookieEnabled) {
        alert("Cookies are still not enabled. Please make sure to enable cookies in your browser settings.");
        return;
      }

      // Clean up test cookies
      document.cookie = "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      document.cookie = "test_third_party_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
      
      // If we got here, cookies are working
      window.location.reload();
    } catch (e) {
      console.error('Cookie acceptance error:', e);
      alert("There was an error checking cookie settings. Please make sure cookies are enabled and try again.");
    }
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
          <li>Select "Allow all cookies" or at least "Allow third-party cookies in incognito"</li>
          <li>Make sure this site is not in the "Sites that can never use cookies" list</li>
          <li>You may need to refresh the page after changing these settings</li>
        </ol>
      );
    } else if (userAgent.includes('firefox')) {
      return (
        <ol className="list-decimal ml-6 mt-2">
          <li>Click the menu button (≡) in the top-right corner</li>
          <li>Click "Settings"</li>
          <li>Click "Privacy & Security"</li>
          <li>Under "Enhanced Tracking Protection", select "Standard" or "Custom"</li>
          <li>If using "Custom", make sure "Cookies" is set to "All Cookies" or add this site as an exception</li>
          <li>You may need to refresh the page after changing these settings</li>
        </ol>
      );
    } else if (userAgent.includes('safari')) {
      return (
        <ol className="list-decimal ml-6 mt-2">
          <li>Click "Safari" in the top menu</li>
          <li>Click "Preferences"</li>
          <li>Go to the "Privacy" tab</li>
          <li>Uncheck "Prevent cross-site tracking"</li>
          <li>Make sure "Block all cookies" is unchecked</li>
          <li>You may need to refresh the page after changing these settings</li>
        </ol>
      );
    }
    return (
      <p className="mt-2">
        Please check your browser's settings and ensure both first-party and third-party cookies are enabled. 
        Look for options like "Allow all cookies" or "Third-party cookies" in your browser's privacy settings.
        You may need to add this site to your allowed sites list or exceptions.
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
                This site requires both first-party and third-party cookies to function properly. 
                Please enable cookies in your browser settings to access all features.
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
