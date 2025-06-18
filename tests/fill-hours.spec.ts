import { test, Locator, Page } from '@playwright/test';
import { config } from '../src/config';
import { generateTimeEntry, isValidTimeFormat } from '../src/time-utils';
import { logger } from '../src/logger';

interface RowData {
  index: number;
  dateText: string;
  isWeekend: boolean;
  entranceCell: Locator;
  exitCell: Locator;
}

interface FillResult {
  success: boolean;
  value?: string;
  error?: string;
}

/**
 * Clicks on a cell, fills it with the specified value, and validates the input.
 * Skips filling if the cell already contains a value.
 */
async function clickAndFill(cell: Locator, value: string): Promise<FillResult> {
  const page = cell.page();

  try {
    const inputLocator = cell.locator('input');
    const timeSpan = cell.locator('span').nth(1); // span with visible text

    const hasInput = await inputLocator.count() > 0;

    if (hasInput) {
      const isVisible = await inputLocator.isVisible();

      let currentValue = '';

      if (isVisible) {
        currentValue = (await inputLocator.inputValue()).trim();
        logger.debug(`Input is visible. Current input value: "${currentValue}"`);
      } else {
        // Fall back to reading the displayed span
        currentValue = (await timeSpan.innerText()).trim();
        logger.debug(`Input not visible. Current span value: "${currentValue}"`);
      }

      if (currentValue) {
        logger.skip(`Field already contains "${currentValue}"`);
        return { success: true, value: currentValue };
      }
    } else {
      // No input at all, fall back to checking span
      const spanText = (await timeSpan.innerText()).trim();
      logger.debug(`No input element found. Span value: "${spanText}"`);

      if (spanText) {
        logger.skip(`Field already contains "${spanText}"`);
        return { success: true, value: spanText };
      }
    }

    // Validate input before attempting to fill
    if (!isValidTimeFormat(value)) {
      throw new Error(`Invalid time format: ${value}`);
    }

    // Only if really empty, we try to type
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Close any popups before attempting to interact with the cell
        await closeAnyPopups(page);
        
        await cell.click();
        await page.waitForTimeout(300);

        // Close popups that might appear after clicking
        await closeAnyPopups(page);

        // Clear existing content and type new value
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await page.keyboard.type(value, { delay: 100 });

        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        // Wait for span to be visible and validate content
        await timeSpan.waitFor({ state: 'visible', timeout: 5000 });

        let newText = (await timeSpan.innerText()).trim();
        if (!newText) {
          logger.warn(`Empty span after typing. Waiting 1 second...`);
          await page.waitForTimeout(1000);
          newText = (await timeSpan.innerText()).trim();
        }

        if (newText.includes(value)) {
          logger.success(`Filled "${value}" successfully on attempt ${attempt}`);
          return { success: true, value: newText };
        } else {
          logger.warn(`Validation failed: Expected "${value}", got "${newText}". Retrying...`);
        }
      } catch (error) {
        logger.warn(`Span not ready on attempt ${attempt}. Error: ${error}. Retrying...`);
      }

      await page.waitForTimeout(500);
    }

    const errorMsg = `Failed to fill "${value}" after ${maxAttempts} attempts`;
    logger.error(errorMsg);
    return { success: false, error: errorMsg };

  } catch (error) {
    const errorMsg = `Unexpected error while filling "${value}": ${error}`;
    logger.error(errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Checks if a date represents a weekend (Friday or Saturday in Hebrew)
 */
function isWeekend(dateText: string): boolean {
  return dateText.includes('ו') || dateText.includes('ש');
}

/**
 * Extracts row data from a table row
 */
async function extractRowData(row: Locator, index: number): Promise<RowData | null> {
  try {
    const tds = row.locator('td');
    const cellCount = await tds.count();

    if (cellCount < 4) {
      logger.warn(`Row ${index}: Not enough cells (${cellCount}), skipping.`);
      return null;
    }

    const dateCell = tds.nth(1);
    const dateText = (await dateCell.locator('span div div p').first().textContent() || '').trim();
    const isWeekendDay = isWeekend(dateText);

    return {
      index,
      dateText,
      isWeekend: isWeekendDay,
      entranceCell: tds.nth(2),
      exitCell: tds.nth(3),
    };
  } catch (error) {
    logger.error(`Failed to extract data from row ${index}: ${error}`);
    return null;
  }
}

/**
 * Waits for the next row to be ready for interaction
 */
async function waitForNextRow(rows: Locator, currentIndex: number): Promise<void> {
  const nextIndex = currentIndex + 1;
  const totalRows = await rows.count();

  if (nextIndex < totalRows) {
    try {
      const nextEntranceCell = rows.nth(nextIndex).locator('td').nth(2);
      logger.info(`Waiting for Row ${nextIndex} entrance cell to be ready...`);
      await nextEntranceCell.waitFor({ state: 'visible', timeout: 5000 });
      await nextEntranceCell.page().waitForTimeout(300);
    } catch (error) {
      logger.warn(`Row ${nextIndex} not ready: ${error}`);
    }
  }
}

/**
 * Attempts to close any visible popups or modal dialogs
 */
async function closeAnyPopups(page: Page): Promise<void> {
  try {
    // Try to close common modal/popup selectors
    const popupSelectors = [
      '[role="dialog"]',
      '.modal',
      '.popup',
      '.overlay',
      '[data-testid*="modal"]',
      '[data-testid*="popup"]',
      '[data-testid*="dialog"]',
      '.swal2-container', // SweetAlert2
      '.ui-dialog', // jQuery UI
      '[class*="modal"]',
      '[class*="popup"]'
    ];

    for (const selector of popupSelectors) {
      const popup = page.locator(selector).first();
      if (await popup.isVisible()) {
        logger.info(`Closing popup with selector: ${selector}`);
        
        // Try to find and click close button
        const closeSelectors = [
          'button[aria-label="Close"]',
          'button[aria-label="close"]',
          '.close',
          '[data-dismiss="modal"]',
          '[data-testid*="close"]',
          'button:has-text("×")',
          'button:has-text("Close")',
          'button:has-text("סגור")', // Hebrew "Close"
          'button:has-text("בטל")'   // Hebrew "Cancel"
        ];

        let closed = false;
        for (const closeSelector of closeSelectors) {
          const closeBtn = popup.locator(closeSelector).first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            logger.success(`Closed popup using: ${closeSelector}`);
            closed = true;
            break;
          }
        }

        // If no close button found, try pressing Escape
        if (!closed) {
          await page.keyboard.press('Escape');
          logger.info('Attempted to close popup with Escape key');
        }

        await page.waitForTimeout(500); // Wait for popup to close
        break; // Only handle one popup at a time
      }
    }
  } catch (error) {
    logger.warn(`Error while trying to close popups: ${error}`);
  }
}

test('fill meckano hours after login', async ({ page }: { page: Page }) => {
  logger.info('Starting Meckano hours filling automation');
  
  // Setup popup handlers to automatically close any popups
  page.on('dialog', async (dialog) => {
    logger.warn(`Popup detected: ${dialog.type()} - "${dialog.message()}" - Auto-dismissing`);
    await dialog.dismiss();
  });

  // Handle page alerts and confirmations
  page.on('pageerror', (error) => {
    logger.warn(`Page error detected: ${error.message}`);
  });

  try {
    // Navigate to login page
    await page.goto(config.baseUrl);
    logger.info(`Navigated to ${config.baseUrl}`);

    // Close any initial popups
    await closeAnyPopups(page);

    // Fill login credentials
    await page.fill('#email', config.email);
    await page.fill('#password', config.password);
    await page.click('#submitButtons');
    logger.info('Login credentials submitted');

    // Close any popups after login attempt
    await closeAnyPopups(page);

    // Wait for login confirmation and navigation to dashboard
    logger.info('Waiting for confirmation code if needed...');
    await page.waitForURL('**/#dashboard', { timeout: config.timeouts.login });
    logger.success('Successfully logged in and navigated to dashboard');

    // Navigate to monthly report
    await page.getByText('כפתור כניסה', { exact: true }).waitFor({ 
      state: 'visible', 
      timeout: config.timeouts.navigation 
    });
    
    // Close any popups before navigation
    await closeAnyPopups(page);
    
    await page.locator('a:has-text("דוח חודשי")').click();
    logger.info('Navigated to monthly report');

    // Close any popups after navigation
    await closeAnyPopups(page);

    // Wait for table to load
    await page.getByRole('cell', { name: 'תאריך' }).locator('span').waitFor({ 
      state: 'visible', 
      timeout: config.timeouts.element 
    });

    // Use CSS selector instead of XPath
    await page.waitForSelector('#mainview table', { 
      state: 'visible', 
      timeout: config.timeouts.element 
    });

    const rows = page.locator('#mainview table tbody tr');
    const rowCount = await rows.count();
    logger.info(`Found ${rowCount} rows to process`);

    let processedRows = 0;
    let skippedRows = 0;
    let errorRows = 0;

    // Process each row
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowData = await extractRowData(row, i);

      if (!rowData) {
        skippedRows++;
        continue;
      }

      if (rowData.isWeekend) {
        logger.skip(`Row ${i}: ${rowData.dateText} is Friday or Saturday, skipping.`);
        skippedRows++;
        continue;
      }

      // Generate time entries
      const timeEntry = generateTimeEntry(config.time);
      logger.info(`Row ${i}: Processing ${rowData.dateText} - Entrance=${timeEntry.entrance}, Exit=${timeEntry.exit}`);

      // Close any popups before filling data
      await closeAnyPopups(page);

      // Fill entrance time
      const entranceResult = await clickAndFill(rowData.entranceCell, timeEntry.entrance);
      if (!entranceResult.success) {
        logger.error(`Row ${i}: Failed to fill entrance time - ${entranceResult.error}`);
        errorRows++;
        
        // Try to close popups in case of error
        await closeAnyPopups(page);
        continue;
      }

      // Fill exit time
      const exitResult = await clickAndFill(rowData.exitCell, timeEntry.exit);
      if (!exitResult.success) {
        logger.error(`Row ${i}: Failed to fill exit time - ${exitResult.error}`);
        errorRows++;
        
        // Try to close popups in case of error
        await closeAnyPopups(page);
        continue;
      }

      processedRows++;
      logger.success(`Row ${i}: Successfully processed ${rowData.dateText}`);

      // Close any popups that might have appeared after successful processing
      await closeAnyPopups(page);

      // Wait before processing next row
      await page.waitForTimeout(1000);
      await waitForNextRow(rows, i);
    }

    // Log summary
    logger.info('Automation completed', {
      totalRows: rowCount,
      processedRows,
      skippedRows,
      errorRows,
    });

  } catch (error) {
    logger.error(`Automation failed: ${error}`);
    throw error;
  }
});
