const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    console.log('Navigating...');
    await page.goto('https://antigravity.google/docs/skills', { waitUntil: 'networkidle0', timeout: 15000 });
    const text = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync('docs.txt', text);
    console.log('Docs saved to docs.txt');
    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
