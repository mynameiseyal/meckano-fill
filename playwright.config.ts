import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  timeout: 10 * 60 * 1000, // 10 minutes for all tests
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    video: 'on',
  },
});
