"use client"

import Script from "next/script"

/**
 * Load third-party scripts with optimal strategies.
 * All scripts are optional and only load if corresponding env vars are present.
 *
 * - GA4: NEXT_PUBLIC_GA4_ID (e.g., G-XXXXXXXXXX)
 * - GTM: NEXT_PUBLIC_GTM_ID (e.g., GTM-XXXXXXX)
 * - Plausible: NEXT_PUBLIC_PLAUSIBLE_DOMAIN (e.g., avgd.ua)
 */
export function ThirdPartyScripts() {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
  const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  return (
    <>
      {/* Google Analytics 4 */}
      {GA4_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', { send_page_view: true });
            `}
          </Script>
        </>
      ) : null}

      {/* Google Tag Manager */}
      {GTM_ID ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      ) : null}

      {/* Plausible Analytics */}
      {PLAUSIBLE_DOMAIN ? (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={PLAUSIBLE_DOMAIN}
          strategy="lazyOnload"
        />
      ) : null}
    </>
  )
}
