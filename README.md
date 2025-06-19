# Meckano Hours Filler

A streamlined Playwright-based automation script designed to efficiently fill in work hours on the Meckano platform with TypeScript support and robust error handling.

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

- **🔒 Enterprise Security**: Production-ready security with comprehensive protection
- **🛡️ Secure Environment Management**: Uses `.env` files for credential management
- **⚙️ Configurable Time Ranges**: Customizable entrance/exit time parameters
- **🔧 Robust Error Handling**: Comprehensive error handling with detailed logging
- **📝 TypeScript Support**: Full type safety and better development experience
- **📊 Structured Logging**: Professional logging system with sensitive data protection
- **📅 Weekend Detection**: Automatically skips weekends (Friday and Saturday)
- **✅ Input Validation**: Validates time formats before filling
- **🔄 Retry Logic**: Automatic retry on failures with configurable attempts
- **🎯 Smart Field Detection**: Skips fields that already contain values
- **🧹 Clean Automation**: Streamlined process without complex popup handling
- **📈 Detailed Reporting**: Comprehensive summary of processed, skipped, and failed rows
- **🚀 Web Interface**: Modern Next.js web UI for easy project download and setup

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
   MECKANO_EMAIL=your.email@example.com
   MECKANO_PASSWORD=yourpassword

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
npx playwright test tests/fill-hours.spec.ts --headed
```

### Available Commands:
- `npx playwright test tests/fill-hours.spec.ts` - Run in headless mode
- `npx playwright test tests/fill-hours.spec.ts --headed` - Run with browser UI visible
- `npx playwright test tests/fill-hours.spec.ts --debug` - Run in debug mode

### What the script does:

1. **Secure Login**: Logs into Meckano using credentials from environment variables
2. **Navigate to Timesheet**: Automatically navigates to the monthly report section
3. **Process Workdays**: Iterates through each workday in the timesheet table
4. **Smart Field Handling**: Skips fields that already contain time entries
5. **Generate Random Times**: Creates realistic entrance and exit times within configured ranges
6. **Fill Empty Fields**: Only fills fields that are currently empty
7. **Weekend Handling**: Automatically skips Friday and Saturday entries
8. **Error Recovery**: Handles errors gracefully with detailed logging
9. **Summary Report**: Provides a comprehensive summary of the automation run

### Sample Output:
```
ℹ️ Starting Meckano hours filling automation
✅ Successfully logged in and navigated to dashboard
ℹ️ Navigated to monthly report
ℹ️ Found 32 rows to process
🔄 Row 1: Field already contains "09:16" - skipping
✅ Row 2: Successfully processed 22/05/2025 ה
ℹ️ Automation completed { totalRows: 32, processedRows: 15, skippedRows: 16, errorRows: 1 }
```

## 📁 Project Structure

```
meckano-fill/
├── src/
│   ├── config.ts          # Configuration and environment variable handling
│   ├── logger.ts          # Structured logging system
│   └── time-utils.ts      # Time generation and validation utilities
├── tests/
│   └── fill-hours.spec.ts # Main automation script
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

The script supports the following time configuration parameters in your `.env.local` file:

- `MIN_ENTRANCE_HOUR`: Earliest hour for entrance time (default: 7)
- `MIN_ENTRANCE_MINUTE`: Earliest minute for entrance time (default: 45)
- `MAX_ENTRANCE_HOUR`: Latest hour for entrance time (default: 9)
- `MAX_ENTRANCE_MINUTE`: Latest minute for entrance time (default: 30)
- `MIN_WORK_HOURS`: Minimum work hours per day (default: 9)
- `MAX_WORK_HOURS`: Maximum work hours per day (default: 10)

### Example Configuration:
```env
MECKANO_EMAIL=john.doe@company.com
MECKANO_PASSWORD=mySecurePassword123
MIN_ENTRANCE_HOUR=8
MIN_ENTRANCE_MINUTE=0
MAX_ENTRANCE_HOUR=9
MAX_ENTRANCE_MINUTE=0
MIN_WORK_HOURS=8
MAX_WORK_HOURS=9
```

This configuration will generate entrance times between 8:00-9:00 and work days of 8-9 hours.

## 🔒 Security Features

This project implements enterprise-grade security measures:

### 🛡️ **Data Protection**
- **Sensitive Data Sanitization**: Automatic redaction of passwords, tokens, and secrets in logs
- **Production Logging Control**: Console logging disabled in production environments
- **Environment Variable Security**: Secure handling of credentials with validation

### 🌐 **Web Security**
- **Content Security Policy**: Strict CSP headers prevent XSS attacks
- **Security Headers**: Comprehensive security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- **Path Traversal Protection**: File access validation prevents directory traversal attacks
- **Rate Limiting**: API endpoint protection with automatic cleanup

### 🔐 **Access Control**
- **Input Validation**: All user inputs are validated before processing
- **Error Message Sanitization**: Error responses don't expose sensitive system information
- **Memory Management**: Automatic cleanup prevents memory leaks

### 📊 **Monitoring & Compliance**
- **Audit Trail**: Comprehensive logging for security monitoring
- **Zero Vulnerabilities**: Regular security audits with npm audit
- **Production Ready**: Tested and hardened for production deployment

## 🔍 Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**
   ```
   Error: Environment variable MECKANO_EMAIL is required but not set
   ```
   - Ensure your `.env.local` file exists and contains valid MECKANO_EMAIL and MECKANO_PASSWORD

2. **Login Failures**
   ```
   Error: page.waitForURL: Timeout exceeded
   ```
   - Verify your credentials are correct in `.env.local`
   - Check if the Meckano website is accessible

3. **Element Not Found Errors**
   ```
   Error: locator.waitFor: Timeout exceeded
   ```
   - The Meckano UI may have changed; selectors might need updating
   - Try running with `--headed` flag to see what's happening visually

4. **Browser Installation Issues**
   ```
   Error: Executable doesn't exist
   ```
   - Run `npx playwright install` to download browsers

### Debug Mode:
```bash
npx playwright test tests/fill-hours.spec.ts --debug
```

This opens the browser in debug mode where you can step through the automation and inspect elements.

### Viewing Test Results:
```bash
npx playwright show-report
```

This opens a detailed HTML report of the test execution.

## 🚀 How It Works

### Login Process:
1. Navigates to the Meckano login page
2. Fills in email and password from environment variables
3. Clicks the login button
4. Waits for successful navigation to the dashboard

### Timesheet Processing:
1. Navigates to the monthly report section
2. Waits for the timesheet table to load
3. Identifies all rows in the table
4. For each row:
   - Extracts the date information
   - Checks if it's a weekend (skips if so)
   - Checks if fields already contain values (skips if so)
   - Generates random entrance and exit times
   - Fills the empty fields
   - Validates the input was successful

### Time Generation:
- Entrance times are randomly generated within your configured range
- Exit times are calculated by adding the configured work hours to entrance time
- All times are in HH:MM format (24-hour)
- Times are realistic and follow typical work patterns

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test them: `npx playwright test`
4. Commit your changes: `git commit -m 'Add your feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Open a pull request

### Development Guidelines:
- Use TypeScript for all code
- Follow the existing code structure
- Add proper error handling and logging
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License.

---

**⚠️ Important Notes:**
- This tool is for personal use with your own Meckano account
- Always keep your credentials secure and never commit them to version control
- The script only fills empty fields - it won't overwrite existing time entries
- Use responsibly and in accordance with your company's policies