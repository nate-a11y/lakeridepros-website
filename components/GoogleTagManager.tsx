import Script from 'next/script'

export const GTM_CONTAINER_ID = 'GTM-KKNTGMB7'

export function GoogleTagManager() {
  return <>
    <Script id="google-tag-manager" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
      window.gtag('set', 'linker', {domains: ['lakeridepros.com', 'customer.moovs.app']});
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
    `}</Script>
    <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="Google Tag Manager" aria-hidden="true" /></noscript>
  </>
}
