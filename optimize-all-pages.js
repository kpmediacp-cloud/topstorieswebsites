const fs = require('fs');
const path = require('path');

const targetFiles = [
  'marketplace/google-news-sites-for-sale/index.html',
  'marketplace/top-stories-eligible-websites/index.html',
  'marketplace/google-discover-websites/index.html',
  'marketplace/bing-news-approved-sites/index.html',
  'marketplace/yahoo-news-network-sites/index.html',
  'tools/google-news-site-valuation-calculator/index.html',
  'tools/google-news-approval-check/index.html',
  'knowledge-base/index.html'
];

targetFiles.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) return;

  let html = fs.readFileSync(fullPath, 'utf8');

  // 1. Add theme-color, robots, preconnect if missing
  if (!html.includes('theme-color')) {
    const headInject = `  <meta name="theme-color" content="#07090e">\n  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n`;
    html = html.replace('  <link rel="stylesheet"', headInject + '  <link rel="stylesheet"');
  }

  // 2. Ensure mobileMenuToggle button is present in nav-actions
  if (!html.includes('id="mobileMenuToggle"')) {
    html = html.replace(
      '</div>\n    </div>\n  </header>',
      '  <button id="mobileMenuToggle" class="btn btn-secondary btn-sm" style="display: none; padding: 6px 10px;" aria-label="Toggle Navigation">☰</button>\n      </div>\n    </div>\n  </header>'
    );
  }

  // 3. Ensure Articles Vault is in the navbar
  if (!html.includes('Articles Vault') && !html.includes('articles/index.html')) {
    const relRoot = relPath.startsWith('marketplace/') || relPath.startsWith('tools/') ? '../../' : '../';
    const navItem = `          <li><a href="${relRoot}articles/index.html" class="nav-link">Articles Vault</a></li>\n        </ul>`;
    html = html.replace('        </ul>', navItem);
  }

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`Optimized: ${relPath}`);
});

console.log('All pillar and tool pages optimized for SEO, speed, and mobile responsiveness.');
