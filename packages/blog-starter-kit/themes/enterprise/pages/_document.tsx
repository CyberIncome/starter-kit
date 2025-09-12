import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="stylesheet" id="silktide-consent-manager-css" href="/consent-manager/silktide-consent-manager.css" />
				<script 
					src="/consent-manager/silktide-consent-manager.js" 
					async 
					onLoad="console.log('Silktide script loaded successfully'); window.silktideLoaded = true; initSilktideConfig();"
					onError="console.error('Failed to load Silktide script')"
				></script>
				<script
					dangerouslySetInnerHTML={{
					__html: `
// Wait for Silktide to load before configuring
function initSilktideConfig() {
  console.log('Initializing Silktide config...');
  console.log('silktideCookieBannerManager available:', typeof silktideCookieBannerManager);
  
  // Prevent multiple initializations
  if (window.silktideInitialized) {
    console.log('Silktide already initialized, skipping...');
    return;
  }
  
  if (typeof silktideCookieBannerManager !== 'undefined') {
    console.log('Silktide manager found, configuring...');
    try {
      silktideCookieBannerManager.updateCookieBannerConfig({
  background: {
    showBackground: true
  },
  cookieIcon: {
    position: "bottomLeft"
  },
  text: {
    bannerTitle: 'Your privacy matters to us',
    acceptButtonText: 'Accept all cookies',
    rejectButtonText: 'Reject non-essential cookies',
    banner: {
      description: "<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic. <a href=\"https://your-website.com/cookie-policy\" target=\"_blank\">Cookie Policy.</a></p>",
      acceptAllButtonText: "Accept all",
      acceptAllButtonAccessibleLabel: "Accept all cookies",
      rejectNonEssentialButtonText: "Reject non-essential",
      rejectNonEssentialButtonAccessibleLabel: "Reject non-essential",
      preferencesButtonText: "Preferences",
      preferencesButtonAccessibleLabel: "Toggle preferences"
    },
    preferences: {
      title: "Customize your cookie preferences",
      description: "<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>"
    }
  },
  cookieTypes: [
    {
      id: 'necessary',
      name: 'Necessary',
      description: "<p>These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences.</p>",
      required: true,
      onAccept: function() {
        console.log('Add logic for the required Necessary here');
      }
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: "<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>",
      defaultValue: true,
      onAccept: function() {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
        dataLayer.push({
          'event': 'consent_accepted_analytics',
        });
      },
      onReject: function() {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: "<p>These cookies provide extra features and personalization to improve your experience. They may be set by us or by partners whose services we use.</p>",
      required: false,
      default: false,
      onAccept: function() {
        gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
        dataLayer.push({
          'event': 'consent_accepted_marketing',
        });
        // Microsoft Clarity consent
        if (window.clarity) {
          window.clarity('consentv2', {
            ad_Storage: 'granted',
            analytics_Storage: 'granted'
          });
        }
      },
      onReject: function() {
        gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
        // Microsoft Clarity consent
        if (window.clarity) {
          window.clarity('consentv2', {
            ad_Storage: 'denied',
            analytics_Storage: 'denied'
          });
        }
      }
    }
  ]
});
      console.log('Silktide configuration completed successfully');
      window.silktideInitialized = true;
    } catch (error) {
      console.error('Error configuring Silktide:', error);
    }
  } else {
    // Retry if Silktide hasn't loaded yet
    console.log('Silktide manager not found, retrying...');
    setTimeout(initSilktideConfig, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSilktideConfig);
    } else {
  initSilktideConfig();
}

// Fallback initialization after a delay
setTimeout(function() {
  if (typeof silktideCookieBannerManager === 'undefined') {
    console.log('Silktide still not loaded after delay, trying again...');
    initSilktideConfig();
  }
}, 2000);
						`,
					}}
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `
// Initialize the dataLayer
window.dataLayer = window.dataLayer || [];

// Create the gtag function that pushes to the dataLayer
function gtag() {
  dataLayer.push(arguments);
}

// Set consent defaults
gtag('consent', 'default', {
  analytics_storage: localStorage.getItem('silktideCookieChoice_analytics') === 'true' ? 'granted' : 'denied',
  ad_storage: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
  ad_user_data: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
  ad_personalization: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
  functionality_storage: localStorage.getItem('silktideCookieChoice_necessary') === 'true' ? 'granted' : 'denied',
  security_storage: localStorage.getItem('silktideCookieChoice_necessary') === 'true' ? 'granted' : 'denied'
});
						`,
					}}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
