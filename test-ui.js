const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000/dashboard/tracks');
    
    // Wait for the upload modal to be openable
    await page.waitForTimeout(2000);
    
    // Open upload modal (we need to find the button, usually it's "Upload" or similar)
    // The page has a button that opens the modal
    // Let's just create a dummy file and try to find the input
    
    console.log('App loaded successfully');
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
