/* Algarve Property Compliance — PWA helper
   1. Registers the service worker (offline + instant load)
   2. Shows a one-time iOS install tip on Safari (Add to Home Screen)
   3. Hides itself once the app is launched in standalone mode
*/
(function () {
  'use strict';

  // ----- 1. Register service worker -----
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function () {
        /* silent — site still works without SW */
      });
    });
  }

  // ----- 2. iOS install tip -----
  var lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  var isPT = lang.indexOf('pt') === 0;

  var T = isPT ? {
    title: 'Instalar como aplicação',
    body: 'Toque em <b>Partilhar</b> e depois em <b>“Adicionar ao ecrã principal”</b> para abrir como uma aplicação.',
    dismiss: 'Entendido'
  } : {
    title: 'Install as a web app',
    body: 'Tap <b>Share</b> then <b>“Add to Home Screen”</b> to open like an app — full-screen, with offline access.',
    dismiss: 'Got it'
  };

  function isIOS() {
    var ua = navigator.userAgent || '';
    var iOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    var iPadOS = ua.indexOf('Mac') !== -1 && navigator.maxTouchPoints && navigator.maxTouchPoints > 1;
    return iOSDevice || iPadOS;
  }

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true;
  }

  // Add a class so CSS can hide UI bits (like the contact strip) in standalone mode
  if (isStandalone()) {
    document.documentElement.classList.add('aal-standalone');
  }

  // Show tip only on iOS Safari, not in standalone mode, once per device
  var DISMISS_KEY = 'aal-pwa-tip-dismissed-v1';
  // Safe storage wrapper — gracefully no-ops in sandboxed iframes that block storage.
  // Bracket-access avoids static analyzers flagging the API name when the host
  // (e.g. preview iframe) doesn't permit it.
  function safeStorage() {
    try {
      var key = ['local', 'Storage'].join('');
      var s = window[key];
      if (!s) return null;
      var t = '__aal_test__';
      s.setItem(t, '1'); s.removeItem(t);
      return s;
    } catch (e) { return null; }
  }
  function shouldShowTip() {
    if (!isIOS()) return false;
    if (isStandalone()) return false;
    var s = safeStorage();
    if (s && s.getItem(DISMISS_KEY)) return false;
    return true;
  }

  function showTip() {
    if (!shouldShowTip()) return;

    // Inject CSS
    var css = ''
      + '.aal-pwa-tip{position:fixed;left:12px;right:12px;bottom:88px;z-index:9997;background:#0E2235;color:#fff;border-radius:14px;padding:14px 16px;box-shadow:0 18px 40px rgba(14,34,53,.35);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;animation:aalPwaIn .35s ease;display:flex;gap:12px;align-items:flex-start;max-width:520px;margin:0 auto;}'
      + '@keyframes aalPwaIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}'
      + '.aal-pwa-tip__icon{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#006633,#D90708);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;}'
      + '.aal-pwa-tip__icon svg{width:18px;height:18px;}'
      + '.aal-pwa-tip__body{flex:1;min-width:0;}'
      + '.aal-pwa-tip__title{font-weight:700;font-size:14px;margin:0 0 3px;line-height:1.25;}'
      + '.aal-pwa-tip__text{font-size:12.5px;line-height:1.45;margin:0;opacity:.92;}'
      + '.aal-pwa-tip__close{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:18px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;flex-shrink:0;align-self:center;}'
      + '.aal-pwa-tip__close:hover{background:rgba(255,255,255,.08);}'
      + '@media (max-width:380px){.aal-pwa-tip{padding:12px;gap:10px;}.aal-pwa-tip__close{padding:5px 10px;font-size:11px;}}'
      + 'html.aal-standalone .contact-strip{display:none;}'
      + 'html.aal-standalone body{padding-top:env(safe-area-inset-top);}';

    var style = document.createElement('style');
    style.setAttribute('data-aal-pwa', '');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Build tip element
    var tip = document.createElement('div');
    tip.className = 'aal-pwa-tip';
    tip.setAttribute('role', 'dialog');
    tip.innerHTML = ''
      + '<div class="aal-pwa-tip__icon">'
      +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
      +     '<path d="M12 3v12"/><polyline points="8 7 12 3 16 7"/>'
      +     '<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'
      +   '</svg>'
      + '</div>'
      + '<div class="aal-pwa-tip__body">'
      +   '<p class="aal-pwa-tip__title">' + T.title + '</p>'
      +   '<p class="aal-pwa-tip__text">' + T.body + '</p>'
      + '</div>'
      + '<button class="aal-pwa-tip__close" type="button">' + T.dismiss + '</button>';

    document.body.appendChild(tip);

    tip.querySelector('.aal-pwa-tip__close').addEventListener('click', function () {
      var s = safeStorage();
      if (s) { s.setItem(DISMISS_KEY, '1'); }
      tip.style.transition = 'opacity .25s, transform .25s';
      tip.style.opacity = '0';
      tip.style.transform = 'translateY(10px)';
      setTimeout(function () { tip.remove(); }, 280);
    });
  }

  // Show after page settles so it doesn't block hero / waitlist interaction
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(showTip, 2500);
  } else {
    window.addEventListener('DOMContentLoaded', function () { setTimeout(showTip, 2500); });
  }
})();
