const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const subdirs = fs.readdirSync(articlesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

const staticUrls = [
  { loc: 'https://topstorieswebsites.com/', p: '1.0', f: 'daily' },
  { loc: 'https://topstorieswebsites.com/marketplace/google-news-sites-for-sale/', p: '0.9', f: 'daily' },
  { loc: 'https://topstorieswebsites.com/marketplace/top-stories-eligible-websites/', p: '0.9', f: 'daily' },
  { loc: 'https://topstorieswebsites.com/marketplace/google-discover-websites/', p: '0.9', f: 'daily' },
  { loc: 'https://topstorieswebsites.com/marketplace/bing-news-approved-sites/', p: '0.8', f: 'daily' },
  { loc: 'https://topstorieswebsites.com/marketplace/yahoo-news-network-sites/', p: '0.8', f: 'daily' },
  { loc: 'https://topstorieswebsites.com/tools/google-news-site-valuation-calculator/', p: '0.8', f: 'weekly' },
  { loc: 'https://topstorieswebsites.com/tools/google-news-approval-check/', p: '0.8', f: 'weekly' },
  { loc: 'https://topstorieswebsites.com/knowledge-base/', p: '0.8', f: 'weekly' },
  { loc: 'https://topstorieswebsites.com/articles/', p: '0.9', f: 'daily' },
  { loc: 'https://topstorieswebsites.com/about/', p: '0.8', f: 'monthly' },
  { loc: 'https://topstorieswebsites.com/escrow-guarantee/', p: '0.8', f: 'monthly' },
  { loc: 'https://topstorieswebsites.com/editorial-standards/', p: '0.8', f: 'monthly' },
  { loc: 'https://topstorieswebsites.com/contact/', p: '0.8', f: 'monthly' },
  { loc: 'https://topstorieswebsites.com/privacy/', p: '0.5', f: 'yearly' },
  { loc: 'https://topstorieswebsites.com/terms/', p: '0.5', f: 'yearly' }
];

staticUrls.forEach(u => {
  xml += `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>2026-09-26</lastmod>\n    <changefreq>${u.f}</changefreq>\n    <priority>${u.p}</priority>\n  </url>\n`;
});

subdirs.forEach(slug => {
  xml += `  <url>\n    <loc>https://topstorieswebsites.com/articles/${slug}/</loc>\n    <lastmod>2026-09-26</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
});

xml += '</urlset>\n';

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf8');
console.log(`Updated sitemap.xml with ${staticUrls.length + subdirs.length} total URLs.`);
