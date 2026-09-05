import fs from 'node:fs'

export const GA4_ID = 'G-PN7MJLRQ3T'
export const GTM_ID = 'GTM-KKNTGMB7'
export const MOOVS_EVENTS = [
  'moovs_create_quote', 'moovs_create_reservation', 'moovs_confirm_reservation',
  'moovs_page_view_info', 'moovs_page_view_vehicle', 'moovs_page_view_quote_summary',
  'moovs_page_view_reservation_summary', 'moovs_page_view_reservation_request_summary',
  'moovs_page_view_confirm_quote',
]
export const WEBSITE_EVENTS = ['booking_portal_click', 'booking_intent', 'phone_click', 'sms_click', 'email_click', 'view_service', 'view_vehicle', 'contact_form_start', 'contact_form_submit', 'contact_form_error', 'newsletter_signup', 'event_waitlist_join']
const template = (key, value) => ({ type: 'TEMPLATE', key, value })
const filter = (variable, value, type = 'EQUALS') => ({ type, parameter: [template('arg0', `{{${variable}}}`), template('arg1', value)] })
const portalFilters = [filter('Page Hostname', 'customer.moovs.app'), filter('Page Path', '^/lake-ride-pros(/|$)', 'MATCH_REGEX')]
const websiteFilters = [filter('Page Hostname', '^(www\\.)?lakeridepros\\.com$', 'MATCH_REGEX')]

// Documented gtag.js commands in standard GTM Custom HTML tags avoid relying on
// undocumented native-template export schemas. Scripts are ES5-compatible.
export const initializePortal = `<script>
(function(w,d){
  if(w.location.hostname!=='customer.moovs.app'||!/^\\/lake-ride-pros(\\/|$)/.test(w.location.pathname)) return;
  if(w.__lrpMoovsGa4Initialized) return;
  w.__lrpMoovsGa4Initialized=true;
  w.dataLayer=w.dataLayer||[];
  w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};
  w.gtag('set','linker',{domains:['lakeridepros.com','customer.moovs.app'],accept_incoming:true});
  w.gtag('js',new Date());
  w.gtag('config','${GA4_ID}');
  if(!d.querySelector('script[src*="googletagmanager.com/gtag/js?id=${GA4_ID}"]')){
    var script=d.createElement('script');script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id=${GA4_ID}';d.head.appendChild(script);
  }
})(window,document);
</script>`

export const forwardMoovsEvent = `<script>
(function(w){
  if(w.location.hostname!=='customer.moovs.app'||!/^\\/lake-ride-pros(\\/|$)/.test(w.location.pathname)) return;
  var name={{Event}};
  if(!/^(moovs_create_quote|moovs_create_reservation|moovs_confirm_reservation|moovs_page_view_info|moovs_page_view_vehicle|moovs_page_view_quote_summary|moovs_page_view_reservation_summary|moovs_page_view_reservation_request_summary|moovs_page_view_confirm_quote)$/.test(name)) return;
  w.dataLayer=w.dataLayer||[];
  w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};
  var params={send_to:'${GA4_ID}',event_category:'Moovs_Tracking',booking_platform:'moovs'};
  if(name==='moovs_create_reservation'||name==='moovs_confirm_reservation'){
    // Read the event object itself, not a persistent data-layer value that could
    // leak a previous reservation's total into a later event with no value.
    for(var i=w.dataLayer.length-1;i>=0;i--){
      var item=w.dataLayer[i];
      if(item&&item.event===name){
        if(typeof item.value==='number'&&isFinite(item.value)&&item.value>=0){params.value=item.value;params.currency='USD';}
        break;
      }
    }
  }
  w.gtag('event',name,params);
})(window);
</script>`

export const forwardWebsiteEvent = `<script>
(function(w){
  if(!/^(www\\.)?lakeridepros\\.com$/.test(w.location.hostname)) return;
  var name={{Event}};
  if(!/^(${WEBSITE_EVENTS.join('|')})$/.test(name)) return;
  w.dataLayer=w.dataLayer||[];
  w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};
  var params={send_to:'${GA4_ID}'};
  var keys=['booking_location','service_slug','vehicle_slug','form_id','error_type','contact_location'];
  if(name==='booking_portal_click') params.booking_destination='https://customer.moovs.app/lake-ride-pros/';
  for(var i=w.dataLayer.length-1;i>=0;i--){
    var item=w.dataLayer[i];
    if(item&&item.event===name){
      for(var j=0;j<keys.length;j++){
        var key=keys[j];
        if(typeof item[key]==='string') params[key]=item[key].slice(0,100);
      }
      break;
    }
  }
  w.gtag('event',name,params);
})(window);
</script>`

export function buildExport(original) {
  const result = structuredClone(original)
  const version = result.containerVersion
  if (version?.container?.publicId !== GTM_ID) throw new Error('Wrong GTM container')
  if (version.tag?.length || version.trigger?.length || version.variable?.length) throw new Error('Export is no longer empty; merge/review existing configuration first')
  result.exportTime = new Date().toISOString()
  const common = { accountId: version.accountId, containerId: version.containerId }
  const tag = (id, name, html, triggerId) => ({ ...common, tagId: id, name, type: 'html', parameter: [template('html', html), { type: 'BOOLEAN', key: 'supportDocumentWrite', value: 'false' }], firingTriggerId: [triggerId], tagFiringOption: 'ONCE_PER_EVENT' })
  version.tag = [
    tag('1', 'LRP - GA4 portal configuration (Moovs only)', initializePortal, '1'),
    ...MOOVS_EVENTS.map((event, index) => ({ ...tag(String(index + 10), `LRP - GA4 - ${event}`, forwardMoovsEvent, String(index + 10)), setupTag: [{ tagName: 'LRP - GA4 portal configuration (Moovs only)', stopOnSetupFailure: true }] })),
    ...WEBSITE_EVENTS.map((event, index) => tag(String(index + 30), `LRP - GA4 - ${event}`, forwardWebsiteEvent, String(index + 30))),
  ]
  version.trigger = [
    { ...common, triggerId: '1', name: 'LRP - Moovs portal pages only', type: 'PAGEVIEW', filter: portalFilters },
    ...MOOVS_EVENTS.map((event, index) => ({ ...common, triggerId: String(index + 10), name: `LRP - ${event}`, type: 'CUSTOM_EVENT', customEventFilter: [filter('_event', event)], filter: portalFilters })),
    ...WEBSITE_EVENTS.map((event, index) => ({ ...common, triggerId: String(index + 30), name: `LRP - ${event}`, type: 'CUSTOM_EVENT', customEventFilter: [filter('_event', event)], filter: websiteFilters })),
  ]
  version.name = 'LRP website to Moovs attribution and GA4 events'
  version.description = 'GA4 G-PN7MJLRQ3T. Existing website Google tag stays in code; this container configures GA4 only on the Lake Ride Pros Moovs portal to avoid duplicate website page views. No Google Ads IDs or purchase transactions are invented.'
  return result
}

if (process.argv[1]?.endsWith('build-moovs-gtm-export.mjs')) {
  const [input, output] = process.argv.slice(2)
  if (!input || !output || input === output) throw new Error('Usage: node scripts/build-moovs-gtm-export.mjs original.json new-file.json')
  fs.writeFileSync(output, JSON.stringify(buildExport(JSON.parse(fs.readFileSync(input, 'utf8'))), null, 2) + '\n', { flag: 'wx' })
  console.log('Created GTM export without modifying original:', output)
}
