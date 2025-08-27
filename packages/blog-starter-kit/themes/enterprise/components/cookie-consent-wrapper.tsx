import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CookieConsent, { get  } from 'react-cookie-consent';

type CookieConsentContextType = {
  hasConsent: boolean;
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentWrapper = ({ children }: { children: ReactNode }) => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(get('CookieConsent') === 'true');
  }, []);

  return (
    <CookieConsentContext.Provider value={{ hasConsent }}>
      {children}
      <CookieConsent
        debug={process.env.NODE_ENV === 'development'}
        location="bottom"
        buttonText="I understand"
        cookieName="CookieConsent"
        style={{
          background: '#2B373B',
          zIndex: 9999,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '1rem',
        }}
        buttonStyle={{
          color: '#4e503b',
          fontSize: '13px',
          background: '#dadada',
          borderRadius: '5px',
          padding: '10px 20px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          margin: '0.5rem',
        }}
        contentStyle={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 'auto',
          margin: '0.5rem',
        }}
        expires={365}
        onAccept={() => {
          setHasConsent(true);
        }}
        onDecline={() => {
          setHasConsent(false);
        }}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentWrapper');
  }
  return context;
};
