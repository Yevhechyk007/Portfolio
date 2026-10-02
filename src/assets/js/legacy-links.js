const routes = { mobile:'/projects/mobile/', landings:'/projects/landings/', 'web-apps':'/projects/web-apps/', 'case-mobile-v1':'/cases/dripply/', 'case-government-appointment':'/cases/government-appointment/' };
function redirectLegacy() { if (!['/', '/index.html'].includes(location.pathname)) return; const target=routes[location.hash.slice(1)]; if(target)location.replace(target+location.search); }
redirectLegacy();
window.addEventListener('hashchange',redirectLegacy);
