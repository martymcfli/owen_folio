(function() {
    'use strict';

    const STORAGE_KEY = 'om-lang';
    let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

    // Set html lang immediately
    document.documentElement.lang = currentLang;

    // Hide body until translations applied (prevents flash of wrong language)
    const hideStyle = document.createElement('style');
    hideStyle.textContent = 'body{opacity:0;transition:opacity .15s ease}';
    document.head.appendChild(hideStyle);

    // Inject toggle CSS
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lang-toggle {
                display: flex;
                gap: 4px;
                align-items: center;
                margin-left: 16px;
            }
            .lang-btn {
                background: none;
                border: 2px solid transparent;
                border-radius: 8px;
                cursor: pointer;
                padding: 4px 8px;
                font-size: 1.15rem;
                line-height: 1;
                transition: all 0.25s ease;
                opacity: 0.4;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .lang-btn:hover {
                opacity: 0.75;
                background: rgba(255,255,255,0.05);
            }
            .lang-btn.active {
                opacity: 1;
                border-color: #14b8a6;
                background: rgba(20, 184, 166, 0.12);
            }
            @media (max-width: 768px) {
                .lang-toggle {
                    margin-left: 10px;
                }
                .lang-btn {
                    padding: 3px 6px;
                    font-size: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Apply translations to the DOM
    function applyTranslations(lang) {
        const translations = window.__translations;
        if (!translations || !translations[lang]) return;

        const strings = translations[lang];

        // Text content
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            if (strings[key] !== undefined) {
                el.textContent = strings[key];
            }
        });

        // HTML content (for elements with <br>, <span>, etc.)
        document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-html');
            if (strings[key] !== undefined) {
                el.innerHTML = strings[key];
            }
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (strings[key] !== undefined) {
                el.placeholder = strings[key];
            }
        });

        // Alt text
        document.querySelectorAll('[data-i18n-alt]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-alt');
            if (strings[key] !== undefined) {
                el.alt = strings[key];
            }
        });

        // Page title
        if (strings['_pageTitle']) {
            document.title = strings['_pageTitle'];
        }

        // Update html lang
        document.documentElement.lang = lang;

        // Update toggle buttons
        updateToggleState(lang);

        // Dispatch event for page-specific JS
        window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: lang } }));
    }

    function updateToggleState(lang) {
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    // Create the flag toggle
    function createToggle() {
        var toggle = document.createElement('div');
        toggle.className = 'lang-toggle';
        toggle.innerHTML =
            '<button class="lang-btn ' + (currentLang === 'en' ? 'active' : '') + '" data-lang="en" aria-label="English" title="English">' +
                '<span class="flag-icon">🇺🇸</span>' +
            '</button>' +
            '<button class="lang-btn ' + (currentLang === 'fr' ? 'active' : '') + '" data-lang="fr" aria-label="Français" title="Français">' +
                '<span class="flag-icon">🇫🇷</span>' +
            '</button>';

        toggle.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var lang = btn.getAttribute('data-lang');
                if (lang === currentLang) return;
                currentLang = lang;
                localStorage.setItem(STORAGE_KEY, lang);
                applyTranslations(lang);
            });
        });

        // Auto-detect page structure and insert toggle
        var navContainer = document.querySelector('.nav-container');
        var header = document.querySelector('.header');

        if (navContainer) {
            navContainer.appendChild(toggle);
        } else if (header) {
            var headerRight = header.querySelector('.header-right');
            if (headerRight) {
                headerRight.appendChild(toggle);
            } else {
                header.appendChild(toggle);
            }
        }
    }

    // Initialize
    function init() {
        injectStyles();
        createToggle();

        if (currentLang !== 'en') {
            applyTranslations(currentLang);
        }

        // Reveal body
        hideStyle.remove();
        document.body.style.opacity = '1';

        // Notify page scripts
        window.dispatchEvent(new CustomEvent('langReady', { detail: { lang: currentLang } }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    window.__langSystem = {
        getCurrentLang: function() { return currentLang; },
        applyTranslations: applyTranslations
    };
})();
