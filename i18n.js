(function () {
  'use strict';
  var locales = window.PROFILE_LOCALES;
  function validLanguage(language) {
    return Object.prototype.hasOwnProperty.call(locales, language);
  }
  window.updateThemeLabel = function () {
    var copy = locales[window.profileLanguage || 'ko'].page;
    document.getElementById('themeLabel').textContent = currentTheme === 'dark' ? copy.themeDark : copy.themeLight;
  };
  function applyLanguage(language) {
    var selected = validLanguage(language) ? language : 'ko';
    var locale = locales[selected];
    window.profileLanguage = selected;
    document.documentElement.lang = locale.htmlLang;
    document.title = locale.page.title;
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = locale.page[node.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (node) {
      node.setAttribute('aria-label', locale.page[node.dataset.i18nAria]);
    });
    document.querySelectorAll('[data-language]').forEach(function (node) {
      node.setAttribute('aria-current', String(node.dataset.language === selected));
    });
    document.querySelectorAll('[data-download]').forEach(function (node) {
      node.href = 'downloads/chenghao_physical_ai_self_intro_' + selected + '.' + node.dataset.download;
      node.hreflang = locale.htmlLang;
    });
    writePreference('profile-language', selected);
    window.updateThemeLabel();
  }
  function languageFromLocation() {
    var requested = new URLSearchParams(location.search).get('lang');
    return requested !== null ? requested : readPreference('profile-language') || 'ko';
  }
  document.querySelectorAll('[data-language]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      var url = new URL(location.href);
      url.searchParams.set('lang', link.dataset.language);
      history.pushState(null, '', url);
      applyLanguage(link.dataset.language);
    });
  });
  window.addEventListener('popstate', function () { applyLanguage(languageFromLocation()); });
  applyLanguage(languageFromLocation());
})();
