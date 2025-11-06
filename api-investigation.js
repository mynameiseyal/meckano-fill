const { chromium } = require('playwright');
const dotenv = require('dotenv');

dotenv.config();

async function investigateAPI() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  // Enable request/response logging
  const apiCalls = [];
  
  context.on('request', request => {
    if (request.url().includes('meckano.co.il') && 
        (request.method() === 'POST' || request.method() === 'PUT' || request.method() === 'PATCH')) {
      apiCalls.push({
        type: 'REQUEST',
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        postData: request.postData()
      });
    }
  });
  
  context.on('response', response => {
    if (response.url().includes('meckano.co.il') && 
        (response.request().method() === 'POST' || 
         response.request().method() === 'PUT' || 
         response.request().method() === 'PATCH' ||
         response.url().includes('api'))) {
      apiCalls.push({
        type: 'RESPONSE',
        method: response.request().method(),
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    }
  });

  const page = await context.newPage();
  
  try {
    console.log('🔍 Starting API investigation...');
    
    // Login and capture authentication API calls
    console.log('📡 Monitoring login API calls...');
    await page.goto('https://app.meckano.co.il');
    
    await page.getByRole('textbox').first().fill(process.env.MECKANO_EMAIL);
    await page.getByRole('textbox', { name: /סיסמה/ }).fill(process.env.MECKANO_PASSWORD);
    await page.getByRole('button', { name: 'התחברות' }).click();
    
    // Wait for login to complete
    await page.waitForURL('**/#dashboard', { timeout: 30000 });
    console.log('✅ Login completed');
    
    // Navigate to monthly report and capture timesheet API calls
    console.log('📡 Monitoring timesheet API calls...');
    await page.locator('a:has-text("דוח חודשי")').click();
    await page.waitForTimeout(3000);
    
    // Try to interact with a time entry to capture submission API
    console.log('📡 Monitoring time entry API calls...');
    const rows = page.locator('#mainview table tbody tr');
    const rowCount = await rows.count();
    
    if (rowCount > 1) {
      const row = rows.nth(1);
      const entranceCell = row.locator('td').nth(2);
      await entranceCell.click();
      await page.keyboard.type('08:00');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }
    
    console.log('\n🔍 API CALLS DISCOVERED:');
    console.log('========================');
    
    // Group and analyze API calls
    const loginCalls = apiCalls.filter(call => 
      call.url.includes('login') || call.url.includes('auth') || call.url.includes('signin')
    );
    
    const timesheetCalls = apiCalls.filter(call => 
      call.url.includes('timesheet') || call.url.includes('report') || call.url.includes('time')
    );
    
    const otherAPICalls = apiCalls.filter(call => 
      !loginCalls.includes(call) && !timesheetCalls.includes(call)
    );
    
    if (loginCalls.length > 0) {
      console.log('\n🔐 LOGIN/AUTH API CALLS:');
      loginCalls.forEach(call => {
        console.log(`${call.type}: ${call.method} ${call.url}`);
        if (call.status) console.log(`   Status: ${call.status}`);
      });
    }
    
    if (timesheetCalls.length > 0) {
      console.log('\n⏰ TIMESHEET API CALLS:');
      timesheetCalls.forEach(call => {
        console.log(`${call.type}: ${call.method} ${call.url}`);
        if (call.status) console.log(`   Status: ${call.status}`);
      });
    }
    
    if (otherAPICalls.length > 0) {
      console.log('\n🔧 OTHER API CALLS:');
      otherAPICalls.forEach(call => {
        console.log(`${call.type}: ${call.method} ${call.url}`);
        if (call.status) console.log(`   Status: ${call.status}`);
      });
    }
    
    // Save detailed API calls to file for analysis
    require('fs').writeFileSync('api-calls.json', JSON.stringify(apiCalls, null, 2));
    console.log('\n💾 Detailed API calls saved to api-calls.json');
    
    console.log('\n📋 SUMMARY:');
    console.log(`Total API calls captured: ${apiCalls.length}`);
    console.log(`Login/Auth calls: ${loginCalls.length}`);
    console.log(`Timesheet calls: ${timesheetCalls.length}`);
    console.log(`Other calls: ${otherAPICalls.length}`);
    
    if (apiCalls.length > 0) {
      console.log('\n✅ API endpoints discovered! Check api-calls.json for details.');
      console.log('🚀 Next step: Build MCP tools using these endpoints.');
    } else {
      console.log('\n⚠️  No obvious API calls found. Meckano might use:');
      console.log('   - WebSocket connections');
      console.log('   - Form submissions instead of AJAX');
      console.log('   - Obfuscated endpoint names');
    }
    
  } catch (error) {
    console.error('❌ Investigation failed:', error);
  } finally {
    await browser.close();
  }
}

investigateAPI();
