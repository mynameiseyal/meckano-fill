const { runMfaScript } = require('./helpers.js');
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Load cookies from the file
  const cookies = JSON.parse(fs.readFileSync('cookies.json'));

  // Launch browser and create a new context
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // Set cookies in the browser context
  await context.addCookies(cookies);

  // Open a new page and navigate
  const page = await context.newPage();
  await page.goto('https://app.meckano.co.il/login.php#login');
  await page.fill('#email', 'eyal.vosk@evinced.com');
  await page.fill('#password','9uza8y6a');
  await page.click('//*[@id="submitButtons"]/input[1]');

  // Wait for the page to load after login
  await page.waitForLoadState('networkidle'); // Wait until the page finishes loading

  // Check if the URL indicates the dashboard or the MFA page
  const currentUrl = page.url();
  await page.pause();

  // Check if it’s NOT the dashboard page
  if (page.url() !== 'https://app.meckano.co.il/#dashboard') {
    console.log('Not on the dashboard. Assuming MFA page.');
    await page.waitForTimeout(63000);
    // Handle MFA-specific actions
    try {
        console.log('Running mfa.mjs to extract numbers...');
        // Call the function from helpers.js
        const extractedNumbers = await runMfaScript();
        console.log(`Extracted Numbers: ${extractedNumbers}`);
               
        // Fill the numbers
        await page.fill('#numberInput', extractedNumbers);
    } catch (err) {
        console.error('Error:', err);
    }
    // Check again if navigated to the dashboard
    if (page.url() === 'https://app.meckano.co.il/#dashboard') {
        console.log('Successfully navigated to the dashboard after MFA.');
    } else {
        console.error('Failed to navigate to the dashboard after MFA.');
    }
} else {
    console.log('Dashboard page detected directly after login.');  
    await page.click('//*[@id="li-monthly-employee-report"]/a/span[2]');
    await page.waitForTimeout(3000);

    // Wait for the table to load
    await page.waitForSelector('.sortable-list.editable-report.employee-report');

    // Select all rows in the table (exclude the header row)
    const rows = await page.$$('.sortable-list.editable-report.employee-report tbody tr.alt1');

    console.log(`Found ${rows.length} data rows in the table.`);
    await page.pause();

    for (const row of rows) {
        // Check for empty check-in
        const checkInSpan = await row.$('.center.checkin span.checkin');
        const checkInValue = checkInSpan ? await checkInSpan.textContent() : null;
        console.log(checkInValue);

        // Check for empty check-out
        const checkOutSpan = await row.$('.checkout span.checkout');
        const checkOutValue = checkOutSpan ? await checkOutSpan.textContent() : null;
        console.log(checkOutValue);

        // Log missing entries and fill them
        if (!checkInValue || checkInValue.trim() === '') {
        console.log('Missing check-in. Filling it...');
        // Locate the date element inside the second column
        // Locate the Date column
        const dateElement = await row.$('.wrapperNameWorker .employee-information p');
        if (dateElement) {
            const dateText = (await dateElement.textContent()).trim(); // Extract and trim the text
            // Check if it contains 'ו' or 'ש'
            if (dateText.includes('ו') || dateText.includes('ש')) {
                console.log(`Date "${dateText}" contains 'ו' or 'ש'.`);
            } else {
                console.log(`Date "${dateText}" does not contain 'ו' or 'ש'.`);
            }
        } else {
            console.log('Date column not found for this row.');
        }
        const checkInInput = await row.$('.center.checkin input.report-entry');
        if (checkInInput) {
            await checkInSpan.click();
            await checkInSpan.type('09:00');
            // await checkInInput.fill('09:00'); // Replace with desired check-in time
        }
        }

        if (!checkOutValue || checkOutValue.trim() === '') {
        console.log('Missing check-out. Filling it...');
      const checkOutInput = await row.$('.checkout input.report-entry');
      if (checkOutInput) {
        await checkOutInput.fill('17:00'); // Replace with desired check-out time
      }
    }
}
  
  await page.pause();
  await browser.close();
}
})();