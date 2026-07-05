// Render Lucide icons (chevrons, etc.)
lucide.createIcons();

// ============ Trending row horizontal scroll buttons ============
const trendingRow = document.getElementById('trendingRow');
const scrollLeftBtn = document.querySelector('.scroll-btn--left');
const scrollRightBtn = document.querySelector('.scroll-btn--right');

if (trendingRow && scrollLeftBtn && scrollRightBtn) {
    const SCROLL_AMOUNT = 600;

    scrollLeftBtn.addEventListener('click', () => {
        trendingRow.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        trendingRow.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    });

    function updateScrollButtons() {
        const maxScrollLeft = trendingRow.scrollWidth - trendingRow.clientWidth;

        if (trendingRow.scrollLeft <= 0) {
            scrollLeftBtn.style.visibility = 'hidden';
            scrollLeftBtn.style.opacity = '0';
        } else {
            scrollLeftBtn.style.visibility = 'visible';
            scrollLeftBtn.style.opacity = '1';
        }

        if (trendingRow.scrollLeft >= maxScrollLeft - 1) {
            scrollRightBtn.style.visibility = 'hidden';
            scrollRightBtn.style.opacity = '0';
        } else {
            scrollRightBtn.style.visibility = 'visible';
            scrollRightBtn.style.opacity = '1';
        }
    }

    trendingRow.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('load', updateScrollButtons);
    updateScrollButtons(); // run once immediately too, in case load already fired
}


// ============ Language selector dropdown ============
const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');
const langLabel = document.getElementById('langLabel');

if (langBtn && langDropdown && langLabel) {
    const langItems = langDropdown.querySelectorAll('li');

    // Toggle dropdown open/close
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langDropdown.classList.contains('show');

        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    function openDropdown() {
        langDropdown.classList.add('show');
        langBtn.classList.add('open');
    }

    function closeDropdown() {
        langDropdown.classList.remove('show');
        langBtn.classList.remove('open');
    }

    // Select a language
    langItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedLang = item.getAttribute('data-lang');
            langLabel.textContent = selectedLang;

            langItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            closeDropdown();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });
}


// ============ Explore Topics scroll + landing animation ============
const exploreTopicsLink = document.querySelector('.helpcenterexplore a');
const helpcenterQuestions = document.getElementById('helpcenterquestions');

if (exploreTopicsLink && helpcenterQuestions) {
    exploreTopicsLink.addEventListener('click', (e) => {
        e.preventDefault();

        helpcenterQuestions.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Restart the animation every time it's clicked
        helpcenterQuestions.classList.remove('helpcenterquestions--landing');
        void helpcenterQuestions.offsetWidth; // force reflow so the animation can replay
        helpcenterQuestions.classList.add('helpcenterquestions--landing');
    });

    helpcenterQuestions.addEventListener('animationend', () => {
        helpcenterQuestions.classList.remove('helpcenterquestions--landing');
    });
}


// ============ Get help toggle ============
const gethelpToggle = document.getElementById('gethelpToggle');
const gethelpLinks = document.getElementById('gethelpLinks');

if (gethelpToggle && gethelpLinks) {
    gethelpToggle.addEventListener('click', () => {
        gethelpLinks.classList.toggle('show');
        gethelpToggle.classList.toggle('open');
    });
}


// ============ Terms of Use footer language dropdown ============
const termsofuseLangBtn = document.getElementById('termsofuseLangSelector');
const termsofuseLangDropdown = document.getElementById('termsofuseLangDropdown');
const termsofuseLangLabel = document.getElementById('termsofuseLangLabel');

if (termsofuseLangBtn && termsofuseLangDropdown && termsofuseLangLabel) {
    const termsofuseLangItems = termsofuseLangDropdown.querySelectorAll('li');

    termsofuseLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = termsofuseLangDropdown.classList.contains('show');

        if (isOpen) {
            closeTermsofuseDropdown();
        } else {
            openTermsofuseDropdown();
        }
    });

    function openTermsofuseDropdown() {
        termsofuseLangDropdown.classList.add('show');
        termsofuseLangBtn.classList.add('open');
        termsofuseLangBtn.setAttribute('aria-expanded', 'true');
    }

    function closeTermsofuseDropdown() {
        termsofuseLangDropdown.classList.remove('show');
        termsofuseLangBtn.classList.remove('open');
        termsofuseLangBtn.setAttribute('aria-expanded', 'false');
    }

    termsofuseLangItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedLabel = item.getAttribute('data-label') || item.textContent;
            const selectedLang = item.getAttribute('data-lang');

            termsofuseLangLabel.textContent = selectedLabel;
            document.documentElement.setAttribute('lang', selectedLang);

            termsofuseLangItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            closeTermsofuseDropdown();
        });
    });

    document.addEventListener('click', (e) => {
        if (!termsofuseLangBtn.contains(e.target) && !termsofuseLangDropdown.contains(e.target)) {
            closeTermsofuseDropdown();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTermsofuseDropdown();
        }
    });
}
const helpcenterLangBtn = document.getElementById('helpcenterLangBtn');
const helpcenterLangDropdown = document.getElementById('helpcenterLangDropdown');
const helpcenterLangLabel = document.getElementById('helpcenterLangLabel');

if (helpcenterLangBtn && helpcenterLangDropdown && helpcenterLangLabel) {
    const helpcenterLangItems = helpcenterLangDropdown.querySelectorAll('li');

    helpcenterLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = helpcenterLangDropdown.classList.contains('show');

        if (isOpen) {
            closeHelpcenterDropdown();
        } else {
            openHelpcenterDropdown();
        }
    });

    function openHelpcenterDropdown() {
        helpcenterLangDropdown.classList.add('show');
        helpcenterLangBtn.classList.add('open');
    }

    function closeHelpcenterDropdown() {
        helpcenterLangDropdown.classList.remove('show');
        helpcenterLangBtn.classList.remove('open');
    }

    helpcenterLangItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedLang = item.getAttribute('data-lang');
            helpcenterLangLabel.textContent = selectedLang;

            helpcenterLangItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            closeHelpcenterDropdown();
        });
    });

    document.addEventListener('click', (e) => {
        if (!helpcenterLangBtn.contains(e.target) && !helpcenterLangDropdown.contains(e.target)) {
            closeHelpcenterDropdown();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeHelpcenterDropdown();
        }
    });
}

// ============ Email entry on landing page (index.html) ============
// When the user submits their email on the hero or bottom form, send them
// to the Sign Up page with their email pre-filled, Netflix-style. (There's
// no backend endpoint to check whether the email already has an account —
// the Sign Up page itself links to Sign In for existing members.)
function handleLandingEmailSubmit(form) {
    const emailInput = form.querySelector('.signup__input');
    const email = emailInput.value.trim();
    window.location.href = `/check-email/?email=${encodeURIComponent(email)}`;
}

document.querySelectorAll('form.signup, form.signupbottom').forEach((form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLandingEmailSubmit(form);
    });
});


// ============ Helper: inline error message under a form ============
function getOrCreateFormError(form, id) {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('p');
        el.id = id;
        el.style.color = '#e87c03';
        el.style.background = 'rgba(232, 124, 3, 0.1)';
        el.style.border = '1px solid rgba(232, 124, 3, 0.4)';
        el.style.borderRadius = '4px';
        el.style.padding = '10px 12px';
        el.style.fontSize = '0.9rem';
        el.style.marginTop = '10px';
        el.style.display = 'none';
        form.appendChild(el);
    }
    return el;
}

function showFormError(el, message) {
    el.textContent = message;
    el.style.display = 'block';
}

function hideFormError(el) {
    el.style.display = 'none';
}


// ============ Sign up form (signup.html) ============
// The form itself posts straight to the Django "signup" view (see
// templates/pages/signup.html: method="post" action="{% url 'signup' %}").
// We only need to pre-fill the email address that was passed along from
// the landing page — the actual submission is native, so Django's
// SignUpForm validation, CSRF handling, and redirect all just work.
const signupFormEl = document.getElementById('signupform');
if (signupFormEl) {
    const params = new URLSearchParams(window.location.search);
    const prefillEmail = params.get('email');
    const su_emailInput = signupFormEl.querySelector('.signin-input');
    if (prefillEmail && su_emailInput) {
        su_emailInput.value = prefillEmail;
    }
}


// ============ Sign in form (signin.html) ============
// Same story: the form posts straight to the Django "signin" view, so we
// only handle the email pre-fill here and let the native submit happen.
const signinFormEl = document.getElementById('signinform');
if (signinFormEl) {
    const params = new URLSearchParams(window.location.search);
    const prefillEmail = params.get('email');
    const si_emailInput = signinFormEl.querySelector('.signin-input');
    if (prefillEmail && si_emailInput) {
        si_emailInput.value = prefillEmail;
    }
}

// ======================================================================
// Netflix Custom Cookie Preference Center (Unique selectors)
// ======================================================================
function openCookiePref() {
    const modal = document.getElementById('nflxCookieModal');
    const overlay = document.getElementById('nflxCookieOverlay');
    if (!modal) return;
    modal.classList.remove('nflx-cookie-hide');
    if (overlay) overlay.classList.remove('nflx-cookie-hide');
    document.body.style.overflow = 'hidden';
}

function closeCookiePref() {
    const modal = document.getElementById('nflxCookieModal');
    const overlay = document.getElementById('nflxCookieOverlay');
    if (!modal) return;
    modal.classList.add('nflx-cookie-hide');
    if (overlay) overlay.classList.add('nflx-cookie-hide');
    document.body.style.overflow = '';
}

function initCookieTabs() {
    const tabItems = document.querySelectorAll('.nflx-cookie-tab-item');
    const panels = document.querySelectorAll('.nflx-cookie-panel');

    tabItems.forEach(item => {
        const btn = item.querySelector('.nflx-cookie-tab-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            // Remove active classes
            document.querySelectorAll('.nflx-cookie-tab-btn').forEach(b => {
                b.classList.remove('nflx-cookie-active');
                b.setAttribute('aria-selected', 'false');
                b.setAttribute('tabindex', '-1');
            });
            panels.forEach(p => p.classList.add('nflx-cookie-hide'));

            // Set current active
            btn.classList.add('nflx-cookie-active');
            btn.setAttribute('aria-selected', 'true');
            btn.setAttribute('tabindex', '0');

            // Show target panel
            const target = item.getAttribute('data-target');
            const targetPanel = document.getElementById(`nflx-panel-${target}`);
            if (targetPanel) {
                targetPanel.classList.remove('nflx-cookie-hide');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('nflxCookieCloseBtn');
    const saveBtn = document.getElementById('nflxCookieSaveBtn');
    const overlay = document.getElementById('nflxCookieOverlay');

    if (closeBtn) closeBtn.addEventListener('click', closeCookiePref);
    if (saveBtn) saveBtn.addEventListener('click', closeCookiePref);
    if (overlay) overlay.addEventListener('click', closeCookiePref);

    // Escape closes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCookiePref();
    });

    initCookieTabs();
});


// ======================================================================
// Netflix Media Center Custom Clone Logic
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the Media Center page
    const appContainer = document.getElementById('AppContainer');
    if (!appContainer) return;

    // 1. Translucent Header Scroll Effect
    const mainHeader = document.getElementById('mainHeader');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Sidebar Drawer Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sideBarDrawer = document.getElementById('sideBarDrawer');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');

    if (mobileMenuBtn && sideBarDrawer && sidebarOverlay) {
        const toggleSidebar = (show) => {
            sideBarDrawer.classList.toggle('active', show);
            sidebarOverlay.classList.toggle('active', show);
            document.body.style.overflow = show ? 'hidden' : '';
            mobileMenuBtn.setAttribute('aria-expanded', show);
        };

        mobileMenuBtn.addEventListener('click', () => toggleSidebar(true));
        closeSidebar?.addEventListener('click', () => toggleSidebar(false));
        sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

        // Expandable submenus in sidebar
        const expandableBtns = sideBarDrawer.querySelectorAll('.sidebar-nav-link--expandable');
        expandableBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const subNav = document.getElementById(targetId);
                if (subNav) {
                    const isExpanded = btn.classList.contains('expanded');
                    btn.classList.toggle('expanded', !isExpanded);
                    subNav.classList.toggle('hidden', isExpanded);
                }
            });
        });
    }

    // 3. Custom Month Selector Dropdown
    const monthSelector = document.getElementById('monthSelector');
    const monthDropdownList = document.getElementById('monthDropdownList');
    const monthSelectorValue = document.getElementById('monthSelectorValue');

    if (monthSelector && monthDropdownList && monthSelectorValue) {
        monthSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = monthSelector.getAttribute('aria-expanded') === 'true';
            monthSelector.setAttribute('aria-expanded', !isExpanded);
            monthDropdownList.classList.toggle('show', !isExpanded);
        });

        const monthItems = monthDropdownList.querySelectorAll('.month-dropdown-item');
        monthItems.forEach(item => {
            item.addEventListener('click', () => {
                const selectedMonth = item.getAttribute('data-month');
                monthSelectorValue.textContent = selectedMonth;

                monthItems.forEach(i => {
                    i.classList.remove('month-dropdown-item--selected');
                    i.removeAttribute('aria-selected');
                });
                item.classList.add('month-dropdown-item--selected');
                item.setAttribute('aria-selected', 'true');

                // Close list
                monthSelector.setAttribute('aria-expanded', 'false');
                monthDropdownList.classList.remove('show');

                // Trigger a simulated refresh of titles
                refreshGridWithSimulatedLoad();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!monthSelector.contains(e.target) && !monthDropdownList.contains(e.target)) {
                monthSelector.setAttribute('aria-expanded', 'false');
                monthDropdownList.classList.remove('show');
            }
        });
    }

    // 4. Category Filtering System
    const filterTabs = document.querySelectorAll('#filterTabs .filter-tab');
    const titleCards = document.querySelectorAll('.title-card');

    if (filterTabs.length && titleCards.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Set active tab class
                filterTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                const filter = tab.getAttribute('data-filter');
                filterCards(filter);
            });
        });

        // Handle initial filtering based on URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlFilter = urlParams.get('filter');
        if (urlFilter) {
            const matchingTab = document.querySelector(`#filterTabs .filter-tab[data-filter="${urlFilter}"]`);
            if (matchingTab) {
                matchingTab.click();
            }
        }
    }

    function filterCards(filter) {
        const titleCardsGrid = document.getElementById('titleCardsGrid');
        if (!titleCardsGrid) return;

        titleCardsGrid.style.opacity = '0';
        setTimeout(() => {
            titleCards.forEach(card => {
                const cardType = card.getAttribute('data-type');
                if (filter === 'all' || cardType === filter || (filter === 'originals' && card.querySelector('.title-card-tag'))) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            titleCardsGrid.style.opacity = '1';
        }, 150);
    }

    // 5. Simulated Refresh / Load Titles
    function refreshGridWithSimulatedLoad() {
        const titleCardsGrid = document.getElementById('titleCardsGrid');
        if (!titleCardsGrid) return;

        // Save original items
        const originalHTML = titleCardsGrid.innerHTML;

        // Render Skeletons
        titleCardsGrid.innerHTML = `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-meta"></div>
                    <div class="skeleton-tag"></div>
                </div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-meta"></div>
                    <div class="skeleton-tag"></div>
                </div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-meta"></div>
                </div>
            </div>
        `;

        setTimeout(() => {
            titleCardsGrid.innerHTML = originalHTML;
            // Re-apply current category filter if any
            const activeTab = document.querySelector('#filterTabs .filter-tab.active');
            if (activeTab) {
                filterCards(activeTab.getAttribute('data-filter'));
            }
        }, 800);
    }

    // 6. Show More / Simulated Pagination
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            showMoreBtn.disabled = true;
            showMoreBtn.textContent = 'Loading...';

            setTimeout(() => {
                const titleCardsGrid = document.getElementById('titleCardsGrid');
                if (titleCardsGrid) {
                    const extraCards = [
                        {
                            type: 'film',
                            title: 'Glass Onion: A Knives Out Mystery',
                            meta: 'Film · Released',
                            tag: 'Only On Netflix',
                            img: 'pic/pacific.jpg'
                        },
                        {
                            type: 'series',
                            title: 'The Witcher',
                            meta: 'Season 4 · Coming Soon',
                            img: 'pic/peaky6.jpg'
                        },
                        {
                            type: 'documentary',
                            title: 'Beckham',
                            meta: 'Limited Series · Released',
                            tag: 'Only On Netflix',
                            img: 'pic/our_planet_poster.png'
                        }
                    ];

                    extraCards.forEach(c => {
                        const cardArticle = document.createElement('article');
                        cardArticle.className = 'title-card';
                        cardArticle.setAttribute('data-type', c.type);

                        cardArticle.innerHTML = `
                            <a href="mediacenter.html" class="title-card-link">
                              <div class="title-card-img-wrap">
                                <img src="${c.img}" alt="${c.title}" class="title-card-img" loading="lazy" onerror="this.src='https://via.placeholder.com/290x410/141414/E50914?text=NETFLIX'"/>
                                <div class="title-card-overlay">
                                  <span class="title-card-badge ${c.type}-badge">${c.type}</span>
                                </div>
                              </div>
                              <div class="title-card-info">
                                <h3 class="title-card-title">${c.title}</h3>
                                <p class="title-card-meta">${c.meta}</p>
                                ${c.tag ? `<span class="title-card-tag netflix-tag">${c.tag}</span>` : ''}
                              </div>
                            </a>
                        `;
                        titleCardsGrid.appendChild(cardArticle);
                    });

                    // Hide Show More button after loading once
                    showMoreBtn.style.display = 'none';
                }
            }, 1000);
        });
    }

    // (Cookie Banner logic moved to global scope below)

    // 8. Search input filter behavior
    const navSearchInput = document.getElementById('navSearchInput');
    const searchForm = document.getElementById('searchForm');

    if (navSearchInput && searchForm) {
        navSearchInput.addEventListener('input', () => {
            const query = navSearchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.title-card');

            cards.forEach(card => {
                const title = card.querySelector('.title-card-title').textContent.toLowerCase();
                const meta = card.querySelector('.title-card-meta').textContent.toLowerCase();
                if (title.includes(query) || meta.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    // Update Copyright Year dynamically
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});

// ======================================================================
// Global Cookie Banner & Preference Center Integration
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cookie Banner
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieDismissBtn = document.getElementById('cookieDismissBtn');
    const changeCookieBtn = document.getElementById('changeCookieBtn');

    if (cookieBanner) {
        if (!localStorage.getItem('netflix_cookies_dismissed')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1500);
        }

        cookieDismissBtn?.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('netflix_cookies_dismissed', 'true');
        });

        changeCookieBtn?.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            openCookiePref();
        });
    }

    // 2. Cookie Preferences Footer Link (Global)
    const cookiePrefLink = document.getElementById('cookiePrefLink');
    if (cookiePrefLink) {
        cookiePrefLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCookiePref();
        });
    }
});

// ======================================================================
// Netflix Investor Relations Custom Clone Logic
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the Investor Relations page
    const irBody = document.querySelector('.ir-body');
    if (!irBody) return;

    // Make sure Lucide icons are initialized
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileIrNav = document.getElementById('mobileIrNav');

    if (mobileMenuToggle && mobileIrNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileIrNav.classList.toggle('active');
        });
    }

    // 2. Tab Switching Logic
    const navButtons = document.querySelectorAll('.ir-nav-btn, .mobile-ir-nav-btn');
    const tabContents = document.querySelectorAll('.ir-tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTabId = btn.getAttribute('data-tab');
            
            // Update active button state in BOTH desktop and mobile navs
            navButtons.forEach(b => {
                if (b.getAttribute('data-tab') === targetTabId) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });

            // Toggle active content tab
            tabContents.forEach(content => {
                if (content.id === `tab-${targetTabId}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // If switching to Stock Info, draw/refresh the chart
            if (targetTabId === 'stock') {
                drawStockChart('1M');
            }

            // Close mobile menu if open
            if (mobileIrNav) {
                mobileIrNav.classList.remove('active');
            }

            // Scroll to main content area smoothly on mobile
            if (window.innerWidth <= 1024) {
                document.querySelector('.ir-main-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Overview "View All" link redirection shortcut
    const viewAllFinancials = document.getElementById('viewAllFinancials');
    if (viewAllFinancials) {
        viewAllFinancials.addEventListener('click', (e) => {
            e.preventDefault();
            const financialsTabBtn = document.querySelector('.ir-nav-btn[data-tab="financials"]');
            financialsTabBtn?.click();
        });
    }

    // 3. Simulated Stock Price Fluctuation Ticker
    const liveStockPrice = document.getElementById('liveStockPrice');
    const liveStockChange = document.getElementById('liveStockChange');
    const liveStockVolume = document.getElementById('liveStockVolume');
    const stockTimestamp = document.getElementById('stockTimestamp');

    if (liveStockPrice && liveStockChange) {
        let priceVal = 685.42;
        let changeVal = 12.18;
        let percentVal = 1.81;
        let volumeVal = 2.4;

        // Display current date in stock quote footer
        if (stockTimestamp) {
            const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
            stockTimestamp.textContent = new Date().toLocaleDateString('en-US', options);
        }

        setInterval(() => {
            // Simulated variation between -0.15% and +0.15%
            const pctVariation = (Math.random() * 0.3 - 0.15) / 100;
            const diff = priceVal * pctVariation;
            priceVal += diff;
            changeVal += diff;
            percentVal = (changeVal / (priceVal - changeVal)) * 100;

            // Increment volume slightly
            volumeVal += Math.random() * 0.05;

            // Render updates
            liveStockPrice.textContent = `$${priceVal.toFixed(2)}`;
            
            const isUp = changeVal >= 0;
            liveStockChange.className = `stock-change ${isUp ? 'price-up' : 'price-down'}`;
            liveStockChange.innerHTML = `
                <i data-lucide="${isUp ? 'arrow-up-right' : 'arrow-down-left'}"></i>
                ${isUp ? '+' : ''}${changeVal.toFixed(2)} (${isUp ? '+' : ''}${percentVal.toFixed(2)}%)
            `;
            if (window.lucide) {
                window.lucide.createIcons({
                    nodeList: [liveStockChange.querySelector('[data-lucide]')]
                });
            }

            if (liveStockVolume) {
                liveStockVolume.textContent = `${volumeVal.toFixed(1)}M`;
            }
        }, 4000);
    }

    // 4. Interactive SVG Stock Chart
    const timeframeButtons = document.querySelectorAll('#chartTimeframes .time-btn');
    timeframeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeframeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const range = btn.getAttribute('data-range');
            drawStockChart(range);
        });
    });

    // Mock dataset generators for SVG Chart coordinates
    function getChartDataPoints(range) {
        let count = 30;
        let startVal = 620;
        let volatility = 10;
        
        switch (range) {
            case '1D': count = 24; startVal = 675; volatility = 3; break;
            case '5D': count = 40; startVal = 660; volatility = 6; break;
            case '1M': count = 30; startVal = 620; volatility = 12; break;
            case '6M': count = 60; startVal = 540; volatility = 20; break;
            case '1Y': count = 100; startVal = 440; volatility = 35; break;
            case '5Y': count = 120; startVal = 310; volatility = 65; break;
        }

        // Generate points using random walk
        const points = [];
        let curVal = startVal;
        const now = new Date();

        for (let i = 0; i < count; i++) {
            const step = (Math.random() * 2 - 1) * volatility;
            curVal += step;
            // Bound values
            curVal = Math.max(150, Math.min(CurValBound(range), curVal));
            
            // Format dates
            let dateStr = '';
            if (range === '1D') {
                dateStr = `${Math.floor(i / 2) + 9}:00`;
            } else {
                const d = new Date();
                d.setDate(now.getDate() - (count - i));
                dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            
            points.push({ price: curVal, date: dateStr });
        }
        return points;
    }

    function CurValBound(range) {
        return range === '5Y' ? 700 : 695;
    }

    let currentChartData = [];

    function drawStockChart(range) {
        const svg = document.getElementById('stockSvgChart');
        const linePath = document.getElementById('chartLinePath');
        const areaPath = document.getElementById('chartAreaPath');
        if (!svg || !linePath || !areaPath) return;

        const data = getChartDataPoints(range);
        currentChartData = data;

        const width = 760; // relative to SVG viewbox
        const height = 260;
        const paddingLeft = 20;
        const paddingTop = 20;

        const prices = data.map(d => d.price);
        const minPrice = Math.min(...prices) * 0.98;
        const maxPrice = Math.max(...prices) * 1.02;
        const priceRange = maxPrice - minPrice;

        let pathString = '';
        
        data.forEach((p, idx) => {
            const x = paddingLeft + (idx / (data.length - 1)) * (width - paddingLeft);
            const y = (height + paddingTop) - ((p.price - minPrice) / priceRange) * height;
            
            if (idx === 0) {
                pathString += `M ${x} ${y}`;
            } else {
                pathString += ` L ${x} ${y}`;
            }
        });

        linePath.setAttribute('d', pathString);

        // Close path to draw filled gradient area under it
        const firstX = paddingLeft;
        const lastX = width;
        const fillBottomY = height + paddingTop;
        const areaString = `${pathString} L ${lastX} ${fillBottomY} L ${firstX} ${fillBottomY} Z`;
        areaPath.setAttribute('d', areaString);

        setupChartInteraction(svg, data, minPrice, maxPrice, width, height, paddingLeft, paddingTop);
    }

    function setupChartInteraction(svg, data, minPrice, maxPrice, width, height, paddingLeft, paddingTop) {
        const hoverLine = document.getElementById('chartHoverLine');
        const hoverCircle = document.getElementById('chartHoverCircle');
        const tooltip = document.getElementById('chartTooltip');

        if (!hoverLine || !hoverCircle || !tooltip) return;

        const rect = svg.getBoundingClientRect();

        const handleMove = (clientX, clientY) => {
            const xInSvg = ((clientX - rect.left) / rect.width) * 800; // mapped to viewbox coordinates
            
            // Find closest data point index
            const stepWidth = (width - paddingLeft) / (data.length - 1);
            let idx = Math.round((xInSvg - paddingLeft) / stepWidth);
            idx = Math.max(0, Math.min(data.length - 1, idx));

            const point = data[idx];
            const x = paddingLeft + idx * stepWidth;
            const y = (height + paddingTop) - ((point.price - minPrice) / (maxPrice - minPrice)) * height;

            // Show and position elements
            hoverLine.setAttribute('x1', x);
            hoverLine.setAttribute('x2', x);
            hoverLine.style.display = 'block';

            hoverCircle.setAttribute('cx', x);
            hoverCircle.setAttribute('cy', y);
            hoverCircle.style.display = 'block';

            // Tooltip text
            tooltip.style.display = 'block';
            tooltip.innerHTML = `
                <strong>$${point.price.toFixed(2)}</strong><br/>
                <span style="color: rgba(255,255,255,0.6); font-size: 11px;">${point.date}</span>
            `;

            // Position tooltip dynamically
            const tooltipRect = tooltip.getBoundingClientRect();
            const parentRect = svg.parentElement.getBoundingClientRect();
            const leftPos = (clientX - parentRect.left) - tooltipRect.width / 2;
            const topPos = (clientY - parentRect.top) - tooltipRect.height - 15;

            tooltip.style.left = `${leftPos}px`;
            tooltip.style.top = `${topPos}px`;
        };

        const handleLeave = () => {
            hoverLine.style.display = 'none';
            hoverCircle.style.display = 'none';
            tooltip.style.display = 'none';
        };

        // Desktop mouse events
        svg.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        svg.addEventListener('mouseleave', handleLeave);

        // Mobile touch events
        svg.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const t = e.touches[0];
                handleMove(t.clientX, t.clientY);
            }
        });
        svg.addEventListener('touchend', handleLeave);
    }

    // 5. Investment Calculator Returns Math
    const investmentCalculator = document.getElementById('investmentCalculator');
    const calcResultValue = document.getElementById('calcResultValue');
    const calcResultGrowth = document.getElementById('calcResultGrowth');
    const calcResultCAGR = document.getElementById('calcResultCAGR');
    const calculatorResult = document.getElementById('calculatorResult');

    if (investmentCalculator) {
        investmentCalculator.addEventListener('submit', (e) => {
            e.preventDefault();

            const amount = parseFloat(document.getElementById('calcAmount').value);
            const year = parseInt(document.getElementById('calcYear').value);

            if (isNaN(amount) || amount <= 0) return;

            // Real CAGR estimates for Netflix stock back to year selected
            let cagr = 0.20;
            const currentYear = new Date().getFullYear();
            const yearsDiff = currentYear - year;

            switch (year) {
                case 2002: cagr = 0.325; break; // IPO growth
                case 2005: cagr = 0.292; break;
                case 2010: cagr = 0.231; break;
                case 2015: cagr = 0.178; break;
                case 2020: cagr = 0.114; break;
                case 2023: cagr = 0.162; break;
            }

            // Final Value = P * (1 + r)^t
            const finalValue = amount * Math.pow(1 + cagr, yearsDiff);
            const totalGrowthPercent = ((finalValue - amount) / amount) * 100;

            // Render calculations with beautiful fade transition
            calculatorResult.style.opacity = '0';
            calculatorResult.style.display = 'block';

            setTimeout(() => {
                calcResultValue.textContent = `$${finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                calcResultGrowth.textContent = `+${totalGrowthPercent.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`;
                calcResultCAGR.textContent = `${(cagr * 100).toFixed(1)}%`;
                calculatorResult.style.transition = 'opacity 0.3s ease';
                calculatorResult.style.opacity = '1';
            }, 100);
        });
    }

    // 6. Leadership Bios Modals
    const leaderBioBtns = document.querySelectorAll('.leader-bio-btn');
    const bioModalOverlay = document.getElementById('bioModalOverlay');
    const bioModalClose = document.getElementById('bioModalClose');
    const bioModalName = document.getElementById('bioModalName');
    const bioModalRole = document.getElementById('bioModalRole');
    const bioModalBody = document.getElementById('bioModalBody');

    // Leadership database bios
    const bios = {
        ted: {
            name: "Ted Sarandos",
            role: "Co-Chief Executive Officer",
            bio: "<p>Ted Sarandos is Co-CEO of Netflix. Ted has been key to Netflix’s content acquisition strategy since 2000. He led the transition into original productions beginning in 2013 with House of Cards, establishing Netflix as a primary generator of original entertainment.</p><p>He is a member of the Academy of Motion Picture Arts and Sciences, the Television Academy, and serves on the board of directors of Spotify.</p>"
        },
        greg: {
            name: "Greg Peters",
            role: "Co-Chief Executive Officer",
            bio: "<p>Greg Peters is Co-CEO of Netflix. Previously, he served as Chief Operating Officer and Chief Product Officer, leading the product design, engineering, and business development divisions.</p><p>Greg joined Netflix in 2008 and has overseen key milestones, including development of Netflix's global infrastructure partnerships and expansion into mobile games.</p>"
        },
        spencer: {
            name: "Spencer Neumann",
            role: "Chief Financial Officer",
            bio: "<p>Spencer Neumann is CFO of Netflix. Spencer joined Netflix in 2019, bringing over 20 years of finance and corporate leadership experience. Previously, he served as CFO of Activision Blizzard and held senior finance leadership positions at The Walt Disney Company.</p><p>He holds a B.A. in Economics and an M.B.A. from Harvard University.</p>"
        },
        reed: {
            name: "Reed Hastings",
            role: "Executive Chairman",
            bio: "<p>Reed Hastings co-founded Netflix in 1997 and served as CEO for 25 years before transitioning to Executive Chairman in 2023. Under his leadership, Netflix disrupted the home video rental business model and pioneered internet television streaming.</p><p>Reed is also an active educational philanthropist, serving on the boards of multiple educational initiatives and charter schools.</p>"
        }
    };

    if (leaderBioBtns.length && bioModalOverlay && bioModalClose) {
        leaderBioBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-leader');
                const data = bios[key];
                if (data) {
                    bioModalName.textContent = data.name;
                    bioModalRole.textContent = data.role;
                    bioModalBody.innerHTML = data.bio;
                    
                    bioModalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeModal = () => {
            bioModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        bioModalClose.addEventListener('click', closeModal);
        bioModalOverlay.addEventListener('click', (e) => {
            if (e.target === bioModalOverlay) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bioModalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 7. Email Alerts Newsletter Form Validation
    const irAlertsForm = document.getElementById('irAlertsForm');
    const alertsSuccessMsg = document.getElementById('alertsSuccessMsg');

    if (irAlertsForm && alertsSuccessMsg) {
        irAlertsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('alertsEmail');
            if (emailInput && emailInput.value.trim()) {
                // Animate success message
                alertsSuccessMsg.style.display = 'block';
                alertsSuccessMsg.style.opacity = '0';
                setTimeout(() => {
                    alertsSuccessMsg.style.transition = 'opacity 0.3s ease';
                    alertsSuccessMsg.style.opacity = '1';
                }, 50);

                emailInput.value = '';
                setTimeout(() => {
                    alertsSuccessMsg.style.opacity = '0';
                    setTimeout(() => {
                        alertsSuccessMsg.style.display = 'none';
                    }, 300);
                }, 4000);
            }
        });
    }

    // 8. Earnings Financials Table Year Filtering
    const earningsYearFilter = document.getElementById('earningsYearFilter');
    const earningsTable = document.getElementById('earningsTable');

    if (earningsYearFilter && earningsTable) {
        earningsYearFilter.addEventListener('change', () => {
            const selectedYear = earningsYearFilter.value;
            const rows = earningsTable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                if (row.classList.contains(`year-row-${selectedYear}`)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });

        // Initialize table filtering
        earningsYearFilter.dispatchEvent(new Event('change'));
    }
});

// ======================================================================
// Netflix Help Center Legal Notice Custom Clone Logic
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the Legal Notices page
    const hcBody = document.querySelector('.hc-body');
    if (!hcBody) return;

    // Render Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Notices Accordion Toggle Logic
    const noticesSummaryBtn = document.getElementById('noticesSummaryBtn');
    const noticesDetailBlock = document.getElementById('noticesDetailBlock');
    
    if (noticesSummaryBtn && noticesDetailBlock) {
        noticesSummaryBtn.addEventListener('click', () => {
            const isExpanded = noticesSummaryBtn.getAttribute('aria-expanded') === 'true';
            
            noticesSummaryBtn.setAttribute('aria-expanded', !isExpanded);
            noticesDetailBlock.classList.toggle('show', !isExpanded);
            noticesDetailBlock.setAttribute('aria-hidden', isExpanded);
        });
    }

    // 2. Print Document Button Trigger
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 3. Cookie Preferences Dialog integration
    const cookiePreferencesLink = document.getElementById('cookiePreferencesLink');
    if (cookiePreferencesLink) {
        cookiePreferencesLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Call OneTrust preferences center modal if present in project
            if (typeof openCookiePref === 'function') {
                openCookiePref();
            } else {
                alert('Cookie Preference modal is currently unavailable. Please try again later.');
            }
        });
    }

    // 4. Language Selector Dropdown Interaction
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('change', () => {
            const selectedLang = langSwitcher.options[langSwitcher.selectedIndex].text;
            // Simulated transition / notification
            const notificationHolder = document.createElement('div');
            notificationHolder.style.position = 'fixed';
            notificationHolder.style.bottom = '30px';
            notificationHolder.style.right = '30px';
            notificationHolder.style.backgroundColor = '#221f1f';
            notificationHolder.style.color = '#ffffff';
            notificationHolder.style.padding = '12px 24px';
            notificationHolder.style.borderRadius = '4px';
            notificationHolder.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            notificationHolder.style.fontSize = '14px';
            notificationHolder.style.fontWeight = '600';
            notificationHolder.style.zIndex = '10000';
            notificationHolder.textContent = `Language switched to ${selectedLang} (Simulation)`;
            
            document.body.appendChild(notificationHolder);
            
            setTimeout(() => {
                notificationHolder.style.transition = 'opacity 0.5s ease';
                notificationHolder.style.opacity = '0';
                setTimeout(() => {
                    notificationHolder.remove();
                }, 500);
            }, 3000);
        });
    }
});

/* COOKIE PREFERENCES MODAL CONTROLLER */
document.addEventListener('DOMContentLoaded', () => {
    const cookieModal = document.getElementById('cookieModal');
    const cookiePrefLink = document.getElementById('cookiePrefLink');
    const closeCookieModal = document.getElementById('closeCookieModal');
    const cookieOverlay = document.getElementById('cookieOverlay');
    const saveCookieSettings = document.getElementById('saveCookieSettings');
    const tabButtons = document.querySelectorAll('.cookie-tab-btn');
    const tabContents = document.querySelectorAll('.cookie-tab-content');

    if (cookiePrefLink) {
        cookiePrefLink.addEventListener('click', (e) => {
            e.preventDefault();
            cookieModal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        });
    }

    const hideModal = () => {
        cookieModal.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    if (closeCookieModal) closeCookieModal.addEventListener('click', hideModal);
    if (cookieOverlay) cookieOverlay.addEventListener('click', hideModal);
    if (saveCookieSettings) saveCookieSettings.addEventListener('click', hideModal);

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("helpcenterSearchInput");
    const searchResults = document.getElementById("helpcenterSearchResults");
    const clearBtn = document.getElementById("helpcenterSearchClear");

    // 1. Extract all topics and links dynamically from your HTML structure
    const links = Array.from(document.querySelectorAll(".helpcenterquestions-list a, .helpcenterquestions-quicklinks-list a"));
    const topics = links.map(link => ({
        text: link.textContent.trim(),
        url: link.getAttribute("href")
    }));

    // 2. Listen for typing events
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        searchResults.innerHTML = ""; // Clear old results

        if (query.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        // Filter topics matching the typed keywords
        const filtered = topics.filter(topic => topic.text.toLowerCase().includes(query));

        if (filtered.length > 0) {
            filtered.forEach(item => {
                const div = document.createElement("div");
                div.className = "search-result-item";
                div.innerHTML = `<a href="${item.url}">${item.text}</a>`;
                searchResults.appendChild(div);
            });
            searchResults.style.display = "block";
        } else {
            // Show a 'No results' state if nothing matches
            searchResults.innerHTML = `<div class="search-result-item" style="color: #666;">No results found</div>`;
            searchResults.style.display = "block";
        }
    });

    // 3. Clear button functionality
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
    });

    // 4. Close the dropdown if user clicks anywhere outside the search container
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".helpecenter-main-search")) {
            searchResults.style.display = "none";
        }
    });
});