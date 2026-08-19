'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { trackEvent } from '@/lib/analytics';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function Analytics() {
  const { signUp } = useSignUp();
  const hasTrackedSignUp = useRef(false);

  useEffect(() => {
    if (!signUp || signUp.status !== 'complete' || hasTrackedSignUp.current) return;

    trackEvent('sign_up_completed', { method: 'clerk' });
    hasTrackedSignUp.current = true;
  }, [signUp]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
