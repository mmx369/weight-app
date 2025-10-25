import React, { useEffect, useRef } from 'react';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
  onError?: () => void;
  siteKey: string;
  action?: string;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

export const ReCaptcha: React.FC<ReCaptchaProps> = ({
  onVerify,
  onError,
  siteKey,
  action = 'submit',
}) => {
  const isLoaded = useRef(false);

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha && !isLoaded.current) {
        isLoaded.current = true;
        window.grecaptcha.ready(() => {
          executeRecaptcha();
        });
      }
    };

    const executeRecaptcha = async () => {
      try {
        const token = await window.grecaptcha.execute(siteKey, {
          action: action,
        });
        onVerify(token);
      } catch (error) {
        console.error('reCAPTCHA v3 error:', error);
        onError?.();
      }
    };

    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = loadRecaptcha;
      document.head.appendChild(script);
    } else {
      loadRecaptcha();
    }

    return () => {
      // Cleanup if needed
    };
  }, [siteKey, onVerify, onError]);

  // reCAPTCHA v3 is invisible, so we don't render anything
  return null;
};

export default ReCaptcha;
