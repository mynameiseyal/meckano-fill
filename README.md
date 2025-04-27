Meckano Hours Filler
A Playwright-based automation script designed to streamline the process of filling in work hours on the Meckano platform.​

📋 Table of Contents
Features

Prerequisites

Installation

Configuration

Usage

Contributing

License

✨ Features
Automates login and navigation to the monthly report on Meckano.

Randomly generates realistic entrance and exit times within specified ranges.

Validates that each time entry is successfully filled before proceeding.

Skips weekends (Friday and Saturday) automatically.

Provides detailed logging for each operation.​

🛠️ Prerequisites
Ensure you have the following installed on your system:

Node.js (version 14.x or higher)

npm (comes with Node.js)

Git (for cloning the repository)​

🚀 Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/mynameiseyal/meckano-fill.git
cd meckano-hours-fill
Install dependencies:

bash
Copy
Edit
npm install
Install Playwright browsers:

bash
Copy
Edit
npx playwright install
⚙️ Configuration
Create a .env file in the root directory and add your Meckano credentials:

env
Copy
Edit
email=your.email@example.com
password=yourpassword
Note: Ensure that you do not commit your .env file to version control to protect your credentials.

🧪 Usage
To run the automation script:

bash
Copy
Edit
npx playwright test
The script will:

Navigate to the Meckano login page.

Log in using the provided credentials.

Access the monthly report section.

Iterate through each workday, filling in entrance and exit times.

Validate each entry before moving to the next.​

Note: The script includes delays and validations to mimic human interaction and ensure reliability.

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch: git checkout -b feature/your-feature-name.

Make your changes and commit them: git commit -m 'Add your feature'.

Push to the branch: git push origin feature/your-feature-name.

Open a pull request.​

Please ensure your code adheres to the existing style and includes appropriate tests.

📄 License
This project is licensed under the MIT License.