# Meckano Hours Filler

A robust Playwright-based automation script designed to streamline the process of filling in work hours on the Meckano platform with improved security, error handling, and TypeScript support.

## 📋 Table of Contents

- [Features](#✨-features)
- [Prerequisites](#🛠️-prerequisites)
- [Installation](#🚀-installation)
- [Configuration](#⚙️-configuration)
- [Usage](#🧪-usage)
- [Project Structure](#📁-project-structure)
- [Contributing](#🤝-contributing)
- [License](#📄-license)

## ✨ Features

- **Secure Environment Management**: Uses `.env` files for credential management
- **Configurable Time Ranges**: Customizable entrance/exit time parameters
- **Robust Error Handling**: Comprehensive error handling with detailed logging
- **TypeScript Support**: Full type safety and better development experience
- **Structured Logging**: Professional logging system with different log levels
- **Weekend Detection**: Automatically skips weekends (Friday and Saturday)
- **Input Validation**: Validates time formats before filling
- **Retry Logic**: Automatic retry on failures with configurable attempts
- **Modern Selectors**: Uses CSS selectors instead of fragile XPath
- **Detailed Reporting**: Comprehensive summary of processed, skipped, and failed rows

## 🛠️ Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (version 16.x or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mynameiseyal/meckano-fill.git
   cd meckano-fill
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## ⚙️ Configuration

1. **Create your `.env` file:**
   ```bash
   cp .env .env.local
   ```

2. **Edit `.env.local` with your credentials:**
   ```env
   # Meckano Login Credentials (REQUIRED)
   EMAIL=your.email@example.com
   PASSWORD=yourpassword

   # Time Configuration (OPTIONAL - defaults will be used if not set)
   MIN_ENTRANCE_HOUR=7
   MIN_ENTRANCE_MINUTE=45
   MAX_ENTRANCE_HOUR=9
   MAX_ENTRANCE_MINUTE=30
   MIN_WORK_HOURS=9
   MAX_WORK_HOURS=10
   ```

3. **Important Security Notes:**
   - Never commit your `.env.local` file to version control
   - The `.env` file in the repository contains only template values
   - Your actual credentials should be in `.env.local` which is ignored by git

## 🧪 Usage

### Run the automation:
```bash
npm test
```

### Available Scripts:
- `npm test` - Run tests in headless mode
- `npm run test:headed` - Run tests with browser UI visible
- `npm run test:debug` - Run tests in debug mode
- `npm run build` - Compile TypeScript
- `npm run type-check` - Check TypeScript types without building

### What the script does:

1. **Secure Login**: Logs into Meckano using credentials from environment variables
2. **Navigate**: Automatically navigates to the monthly report section
3. **Process Rows**: Iterates through each workday in the table
4. **Generate Times**: Creates random but realistic entrance and exit times
5. **Fill Data**: Fills the time fields with proper validation and retry logic
6. **Weekend Handling**: Automatically skips Friday and Saturday entries
7. **Error Handling**: Logs detailed information about successes, failures, and skips
8. **Summary Report**: Provides a comprehensive summary at the end

## 📁 Project Structure

```
meckano-fill/
├── src/
│   ├── config.ts          # Configuration and environment variable handling
│   ├── logger.ts          # Structured logging system
│   └── time-utils.ts      # Time generation and validation utilities
├── tests/
│   └── fill-hours.spec.ts # Main test automation script
├── .env                   # Environment template (safe to commit)
├── .env.local            # Your actual credentials (DO NOT COMMIT)
├── .gitignore            # Git ignore patterns
├── package.json          # Node.js dependencies and scripts
├── playwright.config.ts  # Playwright configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🔧 Advanced Configuration

### Time Configuration Options

The script supports the following time configuration parameters:

- `MIN_ENTRANCE_HOUR`: Earliest hour for entrance time (default: 7)
- `MIN_ENTRANCE_MINUTE`: Earliest minute for entrance time (default: 45)
- `MAX_ENTRANCE_HOUR`: Latest hour for entrance time (default: 9)
- `MAX_ENTRANCE_MINUTE`: Latest minute for entrance time (default: 30)
- `MIN_WORK_HOURS`: Minimum work hours per day (default: 9)
- `MAX_WORK_HOURS`: Maximum work hours per day (default: 10)

### Logging Levels

The logger supports different levels:
- `DEBUG`: Detailed debugging information
- `INFO`: General information about progress
- `WARN`: Warning messages for potential issues
- `ERROR`: Error messages for failures

## 🔍 Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**
   - Ensure your `.env.local` file exists and contains valid EMAIL and PASSWORD

2. **Login Failures**
   - Verify your credentials are correct
   - Check if two-factor authentication is required

3. **Element Not Found Errors**
   - The Meckano UI may have changed; selectors might need updating
   - Try running with `--headed` flag to see what's happening

4. **TypeScript Errors**
   - Run `npm run type-check` to identify type issues
   - Ensure all dependencies are installed

### Debug Mode:
```bash
npm run test:debug
```

This will open the browser in debug mode where you can step through the automation.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and ensure they pass type checking: `npm run type-check`
4. Test your changes: `npm test`
5. Commit your changes: `git commit -m 'Add your feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Open a pull request

### Code Style:
- Use TypeScript for all new code
- Follow the existing code structure and patterns
- Add proper error handling and logging
- Include JSDoc comments for functions

## 📄 License

This project is licensed under the ISC License.

---

**⚠️ Security Notice**: This automation tool is for personal use with your own Meckano account. Always ensure your credentials are kept secure and never shared or committed to version control.