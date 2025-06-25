# Backend - Automation Test Portfolio

Express.js backend server with Selenium WebDriver integration and screen recording capabilities.

## 🏗️ Backend Architecture

\`\`\`
backend/
├── server.js                    # Main Express server
├── record.py                    # Python screen recording script
├── server-headless.js                    # Main Express server for headless
├── record-headless.py                    # Python screen recording script for headless
├── package.json                 # Node.js dependencies
├── segments/                    # Video recordings storage
└── selenium-project/            # Java Selenium project
    ├── pom.xml                  # Maven configuration
    ├── testng.xml               # Amazon test suite
    ├── testng-redbus.xml        # RedBus test suite
    ├── testng-all.xml           # All tests suite
    ├── src/test/java/
    │   ├── tests/
    │   │   ├── AmazonTest.java  # Amazon automation
    │   │   └── RedBusTest.java  # RedBus automation
    │   ├── listeners/
    │   │   └── TestListener.java # TestNG listener
    │   └── config/
    │       └── TestConfig.java   # Test visibility control
    └── test-output/             # TestNG reports
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Java JDK (v11+)
- Maven (v3.6+)
- Python 3 (v3.8+)
- Google Chrome
- Linux/Ubuntu (for screen recording)

### Installation

\`\`\`bash
# Install Node.js dependencies
npm install

# Install system dependencies (Ubuntu/Linux)
sudo apt-get update
sudo apt-get install python3-dbus python3-gi gnome-shell

# Setup Selenium project
cd selenium-project
mvn clean compile test-compile
cd ..

# Create segments directory
mkdir -p segments
\`\`\`

### Running the Server

\`\`\`bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
\`\`\`

Server will start on \`http://localhost:5000\`

## 📡 API Endpoints

### Status & Health Check
- **GET** \`/status\` - Get current recording and test execution status
- **GET** \`/test-files\` - Retrieve available test files and content
- **GET** \`/test-suites\` - Get available test suites

### Test Execution
- **POST** \`/execute-test\` - Start test execution with automatic recording
  \`\`\`json
  {
    "testSuite": "testng-all.xml",
    "testName": "AmazonTest.java"
  }
  \`\`\`

### Recording Control
- **POST** \`/start-recording\` - Manually start screen recording
- **POST** \`/stop-recording\` - Manually stop screen recording

### Reports & Media
- **GET** \`/test-reports\` - Get list of available TestNG reports
- **GET** \`/segments/:filename\` - Serve recorded video files
- **GET** \`/test-reports/:filename\` - Serve TestNG report files

## 🧪 Test Management

### Adding New Tests

1. **Create Test File**: Add new test in \`src/test/java/tests/\`
2. **Update TestConfig**: Add test to \`VISIBLE_TESTS\` list
3. **Add Description**: Update \`getTestDescription()\` method
4. **Create Suite**: Optional - create dedicated TestNG XML

### Test Configuration

The \`TestConfig.java\` file controls:
- Which tests are visible to frontend users
- Test descriptions for UI display
- Test suite mappings

### Available Test Suites

- **testng.xml**: Amazon tests only
- **testng-redbus.xml**: RedBus tests only  
- **testng-all.xml**: All available tests

## 🎥 Screen Recording

### Python Recording Script
- Uses DBus interface with GNOME Shell
- Automatic start/stop via TestNG listener
- Saves recordings to \`segments/\` directory
- MP4 format with 30fps

### Recording Flow
1. TestNG suite starts → Listener triggers recording
2. Tests execute → Screen captures all actions
3. Tests complete → Listener stops recording
4. Video available via \`/segments/recording.mp4\`

## 🔧 Configuration

### Server Configuration
\`\`\`javascript
const PORT = 5000                    // Server port
const BACKEND_URL = "http://localhost:5000"  // Base URL
\`\`\`

### TestNG Configuration
\`\`\`xml
<suite name="AutomationPortfolioSuite" verbose="1">
    <listeners>
        <listener class-name="listeners.TestListener"/>
    </listeners>
    <test name="AmazonTest">
        <classes>
            <class name="tests.AmazonTest"/>
        </classes>
    </test>
</suite>
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Maven Build Failures**
\`\`\`bash
# Check Java version
java --version

# Clean and rebuild
cd selenium-project
mvn clean compile test-compile
\`\`\`

**Screen Recording Issues**
\`\`\`bash
# Install DBus dependencies
sudo apt-get install python3-dbus python3-gi

# Check GNOME Shell
gnome-shell --version
\`\`\`

**Chrome Driver Issues**
\`\`\`bash
# Check Chrome installation
google-chrome --version

# WebDriverManager handles driver automatically
# No manual driver setup needed
\`\`\`

### Debug Commands

\`\`\`bash
# Test Maven execution
cd selenium-project
mvn test -Dtest=AmazonTest

# Check server logs
npm start

# Test recording script
python3 record.py
\`\`\`

## 🚀 Deployment

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
NODE_ENV=production npm start
\`\`\`

### Environment Variables
\`\`\`bash
PORT=5000
NODE_ENV=production
\`\`\`
