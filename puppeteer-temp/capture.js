const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1200, height: 630 }
    });
    const page = await browser.newPage();
    
    console.log('Navigating to http://localhost:3000/auth...');
    await page.goto('http://localhost:3000/auth', { waitUntil: 'networkidle0' });
    
    // Inject CSS to hide the right form section, floating security chip, and expand the left visual anchor
    await page.addStyleTag({
      content: `
        /* Hide the right-side content canvas */
        main > section:nth-of-type(2) {
          display: none !important;
        }
        
        /* Expand the left-side visual anchor to full width */
        main > section:nth-of-type(1) {
          width: 100% !important;
          flex: none !important;
        }

        /* Hide the floating AES-256 security chip */
        main > div.fixed {
          display: none !important;
        }
      `
    });
    
    // Wait briefly for CSS application
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const outputPath = path.join(__dirname, '../src/app/opengraph-image.png');
    console.log(`Taking screenshot and saving to: ${outputPath}`);
    
    await page.screenshot({ path: outputPath });
    await browser.close();
    console.log('Screenshot captured successfully.');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    process.exit(1);
  }
})();
