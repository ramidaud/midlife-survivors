const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

(async () => {
  const root = process.cwd();
  const server = http.createServer((request, response) => {
    const file = path.resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    const types = { '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };
    fs.readFile(file, (error, data) => {
      response.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'text/plain' });
      response.end(error ? 'Not found' : data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  server.unref();
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const results = [];
  for (const [name, width, height] of [['desktop', 1280, 900], ['phone', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.route(/^https?:/, request => new URL(request.request().url()).hostname === '127.0.0.1' ? request.continue() : request.abort());
    await page.goto(`http://127.0.0.1:${server.address().port}/assets/stage/home/v4/house-ground-floor/repaint/deliver/review.html`);
    const result = await page.evaluate(() => ({
      images: document.images.length,
      broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
      overflow: document.documentElement.scrollWidth > innerWidth,
      clearanceWarning: document.body.innerText.includes('no connected 96 px route')
    }));
    await page.screenshot({ path: `reports/house-round2/${name}.png` });
    results.push({ name, ...result });
    await page.close();
  }
  await browser.close();
  server.close();
  fs.writeFileSync('reports/house-round2/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results));
  if (results.some(result => result.broken.length || result.overflow || !result.clearanceWarning)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
