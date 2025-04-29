import { test, Locator } from '@playwright/test';

const email: string = process.env.EMAIL!;
const password: string = process.env.PASSWORD!;

/**
 * Clicks on a cell, fills it with the specified value, and validates the input.
 * Skips filling if the cell already contains a value.
 */
async function clickAndFill(cell: Locator, value: string) {
  const page = cell.page();

  const inputLocator = cell.locator('input');
  const timeSpan = cell.locator('span').nth(1); // span with visible text

  const hasInput = await inputLocator.count() > 0;

  if (hasInput) {
    const isVisible = await inputLocator.isVisible();

    let currentValue = '';

    if (isVisible) {
      currentValue = (await inputLocator.inputValue()).trim();
      console.log(`Input is visible. Current input value: "${currentValue}"`);
    } else {
      // Fall back to reading the displayed span
      currentValue = (await timeSpan.innerText()).trim();
      console.log(`Input not visible. Current span value: "${currentValue}"`);
    }

    if (currentValue) {
      console.log(`🔄 Skipping typing: Field already contains "${currentValue}"`);
      return; // Already filled, no need to type
    }
  } else {
    // 🚨 No input at all, fall back to checking span
    const spanText = (await timeSpan.innerText()).trim();
    console.log(`No input element found. Span value: "${spanText}"`);

    if (spanText) {
      console.log(`🔄 Skipping typing: Field already contains "${spanText}"`);
      return;
    }
  }

  // ✅ Only if really empty, we try to type
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await cell.click();
    await page.waitForTimeout(300);

    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(value, { delay: 100 });

    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    try {
      await timeSpan.waitFor({ state: 'visible', timeout: 5000 });

      let newText = (await timeSpan.innerText()).trim();
      if (!newText) {
        console.warn(`⚠️ Empty span after typing. Waiting 1 second...`);
        await page.waitForTimeout(1000);
        newText = (await timeSpan.innerText()).trim();
      }

      if (newText.includes(value)) {
        console.log(`✅ Filled "${value}" successfully on attempt ${attempt}`);
        return;
      } else {
        console.warn(`⚠️ Validation failed: Expected "${value}", got "${newText}". Retrying...`);
      }
    } catch (error) {
      console.warn(`⚠️ Span not ready on attempt ${attempt}. Retrying...`);
    }

    await page.waitForTimeout(500);
  }

  throw new Error(`❌ Failed to fill "${value}" after ${maxAttempts} attempts.`);
}

/**
 * Generates a random entrance time between 07:45 and 09:30.
 */
function getRandomEntranceTime(): string {
  const startMinutes = 7 * 60 + 45;
  const endMinutes = 9 * 60 + 30;
  const randomMinutes = startMinutes + Math.floor(Math.random() * (endMinutes - startMinutes));

  const hours = Math.floor(randomMinutes / 60);
  const minutes = randomMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculates a random exit time based on the entrance time, adding between 9 to 10 hours.
 */
function getExitTime(entrance: string): string {
  const [hours, minutes] = entrance.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const extraMinutes = 9 * 60 + Math.floor(Math.random() * 61); // 9–10h
  date.setMinutes(date.getMinutes() + extraMinutes);

  return date.toTimeString().slice(0, 5);
}

test('fill meckano hours after login', async ({ page }) => {
  await page.goto('https://app.meckano.co.il');

  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('#submitButtons');

  console.log('⏳ Waiting for confirmation code if needed...');
  await page.waitForURL('**/#dashboard', { timeout: 120000 });

  await page.getByText('כפתור כניסה', { exact: true }).waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('a:has-text("דוח חודשי")').click();
  await page.getByRole('cell', { name: 'תאריך' }).locator('span').waitFor({ state: 'visible', timeout: 15000 });

  await page.waitForSelector('xpath=//*[@id="mainview"]/div/table', { state: 'visible', timeout: 15000 });

  const rows = page.locator('xpath=//*[@id="mainview"]/div/table/tbody/tr');
  const rowCount = await rows.count();
  console.log(`Found rows: ${rowCount}`);

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const tds = row.locator('td');

    if (await tds.count() < 4) {
      console.log(`Row ${i}: Not enough cells, skipping.`);
      continue;
    }

    const dateCell = tds.nth(1);
    const dateText = (await dateCell.locator('span div div p').first().textContent() || '').trim();

    if (dateText.includes('ו') || dateText.includes('ש')) {
      console.log(`Row ${i}: ${dateText} is Friday or Saturday, skipping.`);
      continue;
    }

    const entranceCell = tds.nth(2);
    const exitCell = tds.nth(3);

    const randomEntrance = getRandomEntranceTime();
    const randomExit = getExitTime(randomEntrance);

    console.log(`Row ${i}: Filling Entrance=${randomEntrance}, Exit=${randomExit}`);

    await clickAndFill(entranceCell, randomEntrance);
    await clickAndFill(exitCell, randomExit);

    await page.waitForTimeout(1000);

    if (i + 1 < rowCount) {
      const nextEntranceCell = rows.nth(i + 1).locator('td').nth(2);
      console.log(`Waiting for Row ${i + 1} entrance cell to be ready...`);
      await nextEntranceCell.waitFor({ state: 'visible', timeout: 5000 });
      await page.waitForTimeout(300);
    }
  }
});
