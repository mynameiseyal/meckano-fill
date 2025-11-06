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
  wasAlreadyFilled?: boolean; // Indicates if field was skipped because it already had a value
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
        return { success: true, value: currentValue, wasAlreadyFilled: true };
      }
    } else {
      // No input at all, fall back to checking span
      const spanText = (await timeSpan.innerText()).trim();
      logger.debug(`No input element found. Span value: "${spanText}"`);

      if (spanText) {
        logger.skip(`Field already contains "${spanText}"`);
        return { success: true, value: spanText, wasAlreadyFilled: true };
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
        await cell.click();
        await page.waitForTimeout(300);

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
          return { success: true, value: newText, wasAlreadyFilled: false };
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

  if (nextIndex >= totalRows) {
    logger.debug(`No more rows to wait for (${nextIndex} >= ${totalRows})`);
    return;
  }

  try {
    // First check if the next row has enough cells
    const nextRow = rows.nth(nextIndex);
    const nextRowCells = nextRow.locator('td');
    const cellCount = await nextRowCells.count();
    
    if (cellCount < 4) {
      logger.debug(`Row ${nextIndex} has insufficient cells (${cellCount}), skipping wait`);
      return;
    }

    const nextEntranceCell = nextRowCells.nth(2);
    logger.debug(`Waiting for Row ${nextIndex} entrance cell to be ready...`);
    
    // Reduced timeout and better error handling
    await nextEntranceCell.waitFor({ state: 'visible', timeout: 1000 });
    await nextEntranceCell.page().waitForTimeout(100);
    
  } catch (error) {
    logger.debug(`Row ${nextIndex} not ready, continuing anyway: ${error}`);
    // Don't block the test if next row isn't ready - this is not critical
  }
}

/**
 * Attempts to close any system alert dialogs that may appear
 */
async function closeSystemAlertDialog(page: Page): Promise<void> {
  try {
    await page.locator('#systemAlert-dialog a').first().click({ timeout: 3000 });
    logger.info('Closed system alert dialog');
  } catch (error: unknown) {
    // Silently handle system alert dialog errors as they're not critical
    if (process.env.NODE_ENV !== 'production') {
      if (error instanceof Error) {
        logger.debug(`System alert dialog not found or failed to close: ${error.message}`);
      } else {
        logger.debug('Unknown error while closing system alert dialog');
      }
    }
  }
}



test('fill meckano hours after login', async ({ page }: { page: Page }) => {
  // Set a longer timeout for processing all rows (5 minutes)
  test.setTimeout(5 * 60 * 1000);
  
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
    logger.info(`Attempting to navigate to ${config.baseUrl}`);
    await page.goto(config.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    logger.info(`Navigated to ${config.baseUrl}`);

    // Wait for login form to be ready
    logger.info('Waiting for username textbox...');
    await page.getByRole('textbox').first().waitFor({ timeout: 10000 });
    logger.info('Username field found');

    // Fill login credentials
    logger.info('Filling username...');
    await page.getByRole('textbox').first().fill(config.email);
    logger.info('Username filled');
    
    logger.info('Waiting for password field...');
    await page.getByRole('textbox', { name: /סיסמה/ }).waitFor({ timeout: 5000 });
    logger.info('Password field found');
    
    logger.info('Filling password...');
    await page.getByRole('textbox', { name: /סיסמה/ }).fill(config.password);
    logger.info('Password filled');
    
    // Wait for submit button to be clickable and click it with retry logic
    logger.info('Attempting to click submit button...');
    let loginAttempts = 0;
    const maxLoginAttempts = 3;
    
    while (loginAttempts < maxLoginAttempts) {
      try {
        // Wait for login button to be visible and enabled
        await page.getByRole('button', { name: 'התחברות' }).waitFor({ state: 'visible', timeout: 10000 });
        await page.waitForTimeout(500); // Small delay to ensure button is fully ready
        
        // Ensure button is enabled before clicking
        const isEnabled = await page.getByRole('button', { name: 'התחברות' }).isEnabled();
        if (!isEnabled) {
          logger.warn(`Submit button is disabled, waiting...`);
          await page.waitForTimeout(1000);
          loginAttempts++;
          continue;
        }
        
        // Click the button
    await page.getByRole('button', { name: 'התחברות' }).click();
    logger.info('Login credentials submitted');
        break;
        
      } catch (error) {
        loginAttempts++;
        logger.warn(`Login attempt ${loginAttempts} failed: ${error}`);
        
        if (loginAttempts >= maxLoginAttempts) {
          throw new Error(`Failed to click submit button after ${maxLoginAttempts} attempts: ${error}`);
        }
        
        await page.waitForTimeout(1000);
      }
    }

    // Wait for login confirmation and navigation to dashboard
    logger.info('Waiting for confirmation code if needed...');
    await page.waitForURL('**/#dashboard', { timeout: config.timeouts.login });
    logger.success('Successfully logged in and navigated to dashboard');
    
    // Close any system alert dialogs after login
    await closeSystemAlertDialog(page);

    // Navigate to monthly report
    await page.getByText('כפתור כניסה', { exact: true }).waitFor({ 
      state: 'visible', 
      timeout: config.timeouts.navigation 
    });
    
    await page.locator('a:has-text("דוח חודשי")').click();
    logger.info('Navigated to monthly report');
    
    // Close any system alert dialogs after navigation
    await closeSystemAlertDialog(page);

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
    let actuallyFilledRows = 0; // Track rows where we actually filled data

    // Process each row
    for (let i = 0; i < rowCount; i++) {
      try {
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

      let rowHadWork = false; // Track if this row needed any actual filling

      // Fill entrance time
      const entranceResult = await clickAndFill(rowData.entranceCell, timeEntry.entrance);
      if (!entranceResult.success) {
        logger.error(`Row ${i}: Failed to fill entrance time - ${entranceResult.error}`);
        errorRows++;
        continue;
      }
      
      // Check if entrance was actually filled (not just skipped)
      if (!entranceResult.wasAlreadyFilled) {
        rowHadWork = true;
      }

      // Fill exit time
      const exitResult = await clickAndFill(rowData.exitCell, timeEntry.exit);
      if (!exitResult.success) {
        logger.error(`Row ${i}: Failed to fill exit time - ${exitResult.error}`);
        errorRows++;
        continue;
      }
      
      // Check if exit was actually filled (not just skipped)
      if (!exitResult.wasAlreadyFilled) {
        rowHadWork = true;
      }

      processedRows++;
      if (rowHadWork) {
        actuallyFilledRows++;
      }
      logger.success(`Row ${i}: Successfully processed ${rowData.dateText}`);

      // Only wait between rows if we're not at the last row AND we actually did some work
      if (i < rowCount - 1 && rowHadWork) {
        // Reduce wait time for better performance
        await page.waitForTimeout(500);
        await waitForNextRow(rows, i);
      }
      
      } catch (error) {
        logger.error(`Error processing row ${i}: ${error}`);
        errorRows++;
        // Continue with next row instead of failing the entire test
      }
    }

    // Check if no actual work was done
    if (actuallyFilledRows === 0) {
      logger.success('All timesheet entries are already filled - no updates needed!');
    }

    // Log summary
    logger.info('Automation completed', {
      totalRows: rowCount,
      processedRows,
      actuallyFilledRows,
      skippedRows,
      errorRows,
    });

  } catch (error) {
    logger.error(`Automation failed: ${error}`);
    throw error;
  }
});
