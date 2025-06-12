'use client';

import Script from "next/script";

declare global {
  interface Window {
    qualify: (action: string) => void;
  }
}

export function DemoWidgetLoader() {
  return (
    <>
      <Script
        src="/demo-widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Demo widget loaded');
        }}
      />
      <Script
        src="/demo-preview.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Demo preview loaded');
        }}
      />
    </>
  );
}