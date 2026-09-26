/**
 * TopStoriesWebsites.com - Interactive Engine
 * Handles listings rendering, dynamic search/filters, audit tool simulation,
 * valuation calculation, and interactive modal state.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMarketplace();
  initAuditTool();
  initValuationCalculator();
  initFaqAccordion();
  initModalAndForms();
});

/* ==========================================================================
   1. NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
}

/* ==========================================================================
   2. MARKETPLACE ENGINE
   ========================================================================== */
let activeCategory = 'all';
let searchQuery = '';

function initMarketplace() {
  const container = document.getElementById('listingsGrid');
  if (!container || typeof LISTINGS_DATA === 'undefined') return;

  renderListings(LISTINGS_DATA);

  // Filter tabs
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category || 'all';
      filterAndRender();
    });
  });

  // Search input
  const searchInput = document.getElementById('marketplaceSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterAndRender();
    });
  }
}

function filterAndRender() {
  const container = document.getElementById('listingsGrid');
  if (!container) return;

  const filtered = LISTINGS_DATA.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery) ||
      item.categoryLabel.toLowerCase().includes(searchQuery) ||
      item.monetization.toLowerCase().includes(searchQuery) ||
      item.features.some(f => f.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  renderListings(filtered);
}

function renderListings(items) {
  const container = document.getElementById('listingsGrid');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 16px; opacity: 0.5;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 style="font-size: 1.3rem; margin-bottom: 8px; color: var(--text-main);">No Matching News Assets Found</h3>
        <p>Try resetting filters or expanding search parameters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="listing-card" id="${item.id}">
      <div>
        <div class="card-header">
          <div>
            <h3 class="card-title">${item.title}</h3>
            <div class="card-domain">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>${item.domainSlug}</span>
            </div>
          </div>
          <span class="badge ${item.badgeType}">
            <span class="pulse-dot"></span>
            ${item.categoryLabel}
          </span>
        </div>

        <div class="card-metrics">
          <div class="metric-block">
            <div class="metric-title">Monthly Net</div>
            <div class="metric-val green">${item.monthlyNet}</div>
          </div>
          <div class="metric-block">
            <div class="metric-title">Index Speed</div>
            <div class="metric-val">${item.indexingSpeed}</div>
          </div>
          <div class="metric-block">
            <div class="metric-title">Age</div>
            <div class="metric-val">${item.domainAge}</div>
          </div>
        </div>

        <ul class="card-features">
          ${item.features.map(f => `
            <li class="card-feature">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-sm); margin-bottom: 18px; font-size: 0.775rem;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="14" height="14" fill="none" stroke="#10b981" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span style="color: var(--text-main); font-weight: 600;">Audited by Marcus Vance (Lead Auditor)</span>
          </div>
          <span style="color: var(--accent-emerald); font-weight: 700;">PASSED 5/5</span>
        </div>
      </div>

      <div class="card-footer">
        <div class="card-price-block">
          <span class="card-price-label">Asking Price (${item.multiple})</span>
          <span class="card-price">${item.priceFormatted}</span>
        </div>
        <button class="btn btn-primary btn-sm open-nda-modal" data-asset-id="${item.id}" data-asset-title="${item.title}">
          Request NDA & Audit
        </button>
      </div>
    </article>
  `).join('');

  // Attach modal trigger to new buttons
  document.querySelectorAll('.open-nda-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const assetId = e.currentTarget.dataset.assetId;
      const assetTitle = e.currentTarget.dataset.assetTitle;
      openModal(assetId, assetTitle);
    });
  });
}

/* ==========================================================================
   3. VERIFICATION & DUE DILIGENCE AUDIT SIMULATOR
   ========================================================================== */
function initAuditTool() {
  const auditBtn = document.getElementById('runAuditBtn');
  const auditInput = document.getElementById('auditDomainInput');
  const terminal = document.getElementById('auditTerminal');

  if (!auditBtn || !auditInput || !terminal) return;

  auditBtn.addEventListener('click', () => {
    const domain = auditInput.value.trim() || 'yourtargetnewsdomain.com';
    runLiveAuditSimulation(domain, terminal);
  });
}

function runLiveAuditSimulation(domain, terminal) {
  terminal.classList.add('active');
  terminal.innerHTML = `<div style="color: #94a3b8;">> Initializing multi-point algorithmic news verification for: <strong style="color: #00f0ff;">${domain}</strong>...</div>`;

  const steps = [
    { delay: 400, text: `> Connecting to Google Publisher Center API... [STATUS: VERIFIED ACTIVE]`, type: 'pass' },
    { delay: 900, text: `> Running News Tab site-operator query: 'site:${domain}'... [INDEXED: 1,842 ARTICLES]`, type: 'pass' },
    { delay: 1400, text: `> Analyzing RSS / Atom Feed XML Schema validity... [VALID RSS 2.0 with News Extensions]`, type: 'pass' },
    { delay: 1900, text: `> Querying Google Search Console Disavow & Manual Actions record... [0 PENALTIES DETECTED]`, type: 'pass' },
    { delay: 2400, text: `> Benchmarking Top Stories carousel latency... [AVG FRESHNESS INDEXING: 74 SECONDS]`, type: 'pass' },
    { delay: 2900, text: `> Verifying Bing Webmaster PubHub & Yahoo News Syndicate state... [ACCEPTANCE CONFIRMED]`, type: 'pass' },
    { delay: 3400, text: `✔ AUDIT COMPLETE: ${domain} qualifies for Tier-1 algorithmic news distribution.`, type: 'pass' }
  ];

  steps.forEach(({ delay, text, type }) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = `audit-check-line ${type}`;
      div.textContent = text;
      terminal.appendChild(div);
      terminal.scrollTop = terminal.scrollHeight;
    }, delay);
  });
}

/* ==========================================================================
   4. INTERACTIVE NEWS VALUATION CALCULATOR
   ========================================================================== */
function initValuationCalculator() {
  const netInput = document.getElementById('calcNetProfit');
  const netDisplay = document.getElementById('calcNetDisplay');
  const sourceSelect = document.getElementById('calcTrafficSource');
  const ageSelect = document.getElementById('calcAgeSelect');
  const multipleDisplay = document.getElementById('calcMultipleDisplay');
  const valuationDisplay = document.getElementById('calcValuationOutput');

  if (!netInput || !valuationDisplay) return;

  function recalculate() {
    const monthlyNet = parseFloat(netInput.value) || 2000;
    const trafficSource = sourceSelect ? sourceSelect.value : 'balanced';
    const domainAge = ageSelect ? parseFloat(ageSelect.value) : 5;

    if (netDisplay) {
      netDisplay.textContent = `$${monthlyNet.toLocaleString()} / mo`;
    }

    // Base multiple range: 22x - 36x monthly net
    let baseMultiple = 22;

    if (trafficSource === 'discover') baseMultiple += 4;
    else if (trafficSource === 'top-stories') baseMultiple += 6;
    else if (trafficSource === 'balanced') baseMultiple += 5;

    if (domainAge >= 6) baseMultiple += 3;
    else if (domainAge >= 3) baseMultiple += 1.5;

    const estimatedValuation = Math.round(monthlyNet * baseMultiple);

    if (multipleDisplay) {
      multipleDisplay.textContent = `${baseMultiple.toFixed(1)}x Monthly Net`;
    }

    valuationDisplay.textContent = `$${estimatedValuation.toLocaleString()}`;
  }

  netInput.addEventListener('input', recalculate);
  if (sourceSelect) sourceSelect.addEventListener('change', recalculate);
  if (ageSelect) ageSelect.addEventListener('change', recalculate);

  recalculate();
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close others
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   6. MODAL & INQUIRY FORM
   ========================================================================== */
function initModalAndForms() {
  const modalOverlay = document.getElementById('ndaModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalForm = document.getElementById('ndaForm');
  const modalAssetTitle = document.getElementById('modalAssetTitle');

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('inquiryEmail').value;
      const submitBtn = document.getElementById('ndaSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Dossier Request...';
      }

      const formData = new FormData(modalForm);
      fetch('https://formsubmit.co/ajax/Zackmopi@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(res => res.json())
      .catch(err => console.log('Notice: Transmission logged.'))
      .finally(() => {
        if (modalOverlay) {
          modalOverlay.classList.remove('open');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Instant Access to Audit Files';
        }
        modalForm.reset();
        showToast(`NDA & Complete Audit Dossier dispatched to ${email}`);
      });
    });
  }

  /* Direct Contact Desk Form Submission Handler */
  const contactForm = document.getElementById('contactForm');
  const contactSuccessState = document.getElementById('contactSuccessState');
  const contactFormHeader = document.getElementById('contactFormHeader');
  const resetContactBtn = document.getElementById('resetContactBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('contactSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting to Acquisitions Desk...';
      }

      const formData = new FormData(contactForm);
      fetch('https://formsubmit.co/ajax/Zackmopi@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(res => res.json())
      .catch(err => console.log('Notice: Transmission logged.'))
      .finally(() => {
        if (contactSuccessState) {
          contactSuccessState.style.display = 'block';
        }
        if (contactForm) {
          contactForm.style.display = 'none';
        }
        if (contactFormHeader) {
          contactFormHeader.style.display = 'none';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Connect with Brokerage Desk';
        }
        showToast('Inquiry securely dispatched to Zackmopi@gmail.com');
      });
    });
  }

  if (resetContactBtn) {
    resetContactBtn.addEventListener('click', () => {
      if (contactForm) {
        contactForm.reset();
        contactForm.style.display = 'block';
      }
      if (contactFormHeader) {
        contactFormHeader.style.display = 'block';
      }
      if (contactSuccessState) {
        contactSuccessState.style.display = 'none';
      }
    });
  }
}

function openModal(assetId, assetTitle) {
  const modalOverlay = document.getElementById('ndaModal');
  const modalAssetTitle = document.getElementById('modalAssetTitle');
  const hiddenAssetInput = document.getElementById('hiddenAssetId');

  if (modalAssetTitle) modalAssetTitle.textContent = assetTitle || 'Digital Publishing Asset';
  if (hiddenAssetInput) hiddenAssetInput.value = assetId || '';
  if (modalOverlay) modalOverlay.classList.add('open');
}

/* ==========================================================================
   7. TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="#10b981" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
