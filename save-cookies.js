const { chromium } = require('playwright');

(async () => {
  // Launch browser in non-headless mode
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // Open a new page
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto('https://app.meckano.co.il/login.php#login');

  console.log('Please log in manually...');
  // Wait for manual login to complete
  await page.waitForTimeout(60000); // Wait for 60 seconds (adjust as needed)

  // Save cookies after login
  const cookies = await context.cookies();
  console.log('Cookies:', JSON.stringify(cookies, null, 2));

  // Save cookies to a file
  const fs = require('fs');
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

  console.log('Cookies saved to cookies.json');
  await browser.close();
})();
