# Automation Test Portfolio - Shubham Chavan

A comprehensive full-stack automation testing portfolio showcasing Selenium WebDriver, TestNG, and screen recording capabilities with a modern Next.js frontend.

## 🎯 Project Overview

This portfolio demonstrates professional automation testing skills through:
- **Selenium WebDriver** automation with Java
- **TestNG** framework integration with listeners
- **Automatic screen recording** synchronized with test execution
- **Modern web interface** built with Next.js and Tailwind CSS
- **Real-time monitoring** of test execution and recording status
- **Dark/Light mode** theme switching
- **Professional profile** showcase
- **Handy utility scripts** for reusable automation components

## 🏗️ Complete Project Structure

\`\`\`
automation-portfolio/
├── backend/                     # Express.js server + Selenium project
│   ├── server.js               # API server with test execution endpoints
│   ├── record.py               # Python screen recording script
│   ├── package.json            # Backend dependencies
│   ├── segments/               # Recorded videos storage
│   ├── selenium-project/       # Java Maven project
│   │   ├── pom.xml            # Maven configuration
│   │   ├── testng.xml         # Amazon test suite
│   │   ├── testng-redbus.xml  # RedBus test suite
│   │   ├── testng-all.xml     # All tests suite
│   │   └── src/test/java/
│   │       ├── tests/
│   │       │   ├── AmazonTest.java    # Amazon automation
│   │       │   └── RedBusTest.java    # RedBus automation
│   │       ├── listeners/
│   │       │   └── TestListener.java  # TestNG listener
│   │       ├── config/
│   │       │   └── TestConfig.java    # Test visibility control
│   │       └── utils/
│   │           ├── ExcelUtils.java    # Excel operations utility
│   │           ├── ActionUtils.java   # Selenium actions utility
│   │           ├── WaitUtils.java     # Wait strategies utility
│   │           └── ScreenshotUtils.java # Screenshot utility
│   └── README.md               # Backend documentation
├── frontend/                   # Next.js React application
│   ├── app/
│   │   ├── page.tsx           # Main portfolio interface
│   │   ├── layout.tsx         # Root layout with theme
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── theme-provider.tsx # Theme context
│   │   └── theme-toggle.tsx   # Dark/light mode toggle
│   ├── public/
│   │   └── profile.jpeg       # Profile photo
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.ts     # Tailwind configuration
│   ├── next.config.js         # Next.js configuration
│   └── README.md              # Frontend documentation
└── README.md                  # This main documentation
\`\`\`

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Java JDK** (v11+)
- **Maven** (v3.6+)
- **Python 3** (v3.8+)
- **Google Chrome**
- **Linux/Ubuntu** (for screen recording)

### 1. Clone and Setup
\`\`\`bash
git clone <repository-url>
cd automation-portfolio
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
cd selenium-project
mvn clean compile test-compile
cd ..
mkdir -p segments
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
\`\`\`

### 4. System Dependencies (Linux)
\`\`\`bash
sudo apt-get update
sudo apt-get install python3-dbus python3-gi gnome-shell google-chrome-stable
\`\`\`

### 5. Run the Application
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the portfolio interface.

## 🎬 Demo Workflow

1. **Launch Portfolio**: Open the web interface
2. **View Profile**: See professional background and experience
3. **Browse Utility Scripts**: Copy reusable automation utilities
4. **Select Test**: Choose between Amazon or RedBus automation
5. **Execute Tests**: Click run button next to each test
6. **View Code**: Browse the actual Selenium automation code
7. **Watch Recording**: Automatic screen recording starts
8. **Monitor Progress**: Real-time status updates
9. **View Results**: Watch the recorded test execution side-by-side

## 🧪 Available Test Scenarios

### Amazon.com Automation
- **Launch Test**: Open Amazon website and verify page load
- **Search Test**: Search for products and validate results
- **Navigation Test**: Click through product pages
- **Validation Test**: Verify page elements and content

### RedBus.in Automation
- **Launch Test**: Open RedBus website and verify homepage
- **Search Test**: Search for bus routes between cities
- **Listings Test**: Verify bus listings and availability

## 🛠️ Handy Utility Scripts

### ExcelUtils.java
- Read/Write Excel files
- Data-driven testing support
- Cell formatting and validation

### ActionUtils.java
- Mouse hover actions
- Drag and drop operations
- Keyboard shortcuts
- Element interactions

### WaitUtils.java
- Custom wait strategies
- Element visibility waits
- Page load waits
- Dynamic content handling

### ScreenshotUtils.java
- Full page screenshots
- Element-specific captures
- Failure screenshots
- Report attachments

## 📡 API Documentation

### Backend Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Current test and recording status |
| GET | `/test-files` | Available test files and code |
| GET | `/utility-files` | Available utility scripts |
| GET | `/test-suites` | Available test suites |
| POST | `/execute-test` | Start test execution with recording |
| POST | `/start-recording` | Manual recording control |
| POST | `/stop-recording` | Stop recording |
| GET | `/segments/:file` | Serve recorded videos |

## 🔧 Adding New Tests

To add more automation tests:

### 1. Create Test File
\`\`\`bash
# Add new test in backend/selenium-project/src/test/java/tests/
# Example: FlipkartTest.java
\`\`\`

### 2. Update Test Configuration
\`\`\`java
// In TestConfig.java
public static final List<String> VISIBLE_TESTS = Arrays.asList(
    "AmazonTest.java",
    "RedBusTest.java",
    "FlipkartTest.java"  // Add new test here
);
\`\`\`

### 3. Add Test Description
\`\`\`java
// In getTestDescription() method
case "FlipkartTest.java":
    return "E-commerce automation on Flipkart - Product search and comparison";
\`\`\`

## 🎨 Features Showcase

### Technical Skills Demonstrated
- **Java Programming**: Object-oriented test design
- **Selenium WebDriver**: Browser automation expertise
- **TestNG Framework**: Test lifecycle management
- **Maven Build Tool**: Dependency management
- **REST API Development**: Express.js backend
- **React/Next.js**: Modern frontend development
- **Python Scripting**: System integration
- **Linux System Administration**: Screen recording setup

### Professional Capabilities
- **Test Automation Strategy**: End-to-end automation approach
- **Framework Development**: Reusable test components
- **CI/CD Integration**: Automated test execution
- **Reporting & Analytics**: Test result visualization
- **Cross-browser Testing**: Multi-browser support ready
- **Performance Testing**: Load testing capabilities
- **API Testing**: REST API validation

## 🐛 Troubleshooting

### Common Issues & Solutions

**Screen Recording Not Working**
\`\`\`bash
# Install required packages
sudo apt-get install python3-dbus python3-gi gnome-shell

# Check GNOME Shell version
gnome-shell --version
\`\`\`

**Maven Build Issues**
\`\`\`bash
# Clean and rebuild
cd backend/selenium-project
mvn clean compile test-compile

# Check Java version
java --version
\`\`\`

**Frontend Module Errors**
\`\`\`bash
cd frontend
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Theme Toggle Not Working**
- Ensure `next-themes` is properly installed
- Check ThemeProvider wrapper in layout.tsx
- Verify CSS variables are defined in globals.css

## 🚀 Deployment Options

### Local Production
\`\`\`bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
npm start
\`\`\`

### Docker Deployment
\`\`\`dockerfile
# Example docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend/segments:/app/segments
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
\`\`\`

## 📊 Monitoring & Analytics

### Server Logs
- Test execution output
- Recording status updates
- API request/response logs
- Error handling details

### Performance Metrics
- Test execution time
- Recording file sizes
- API response times
- System resource usage

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow existing patterns
2. **Testing**: Add tests for new features
3. **Documentation**: Update README files
4. **Commits**: Use descriptive commit messages

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

**Shubham Chavan**
- Email: shubhamchavan6795@gmail.com
- Phone: +91 7387678795
- LinkedIn: [Connect with me]

---

**Ready to showcase professional automation testing expertise!** 🎯

### Next Steps
1. Follow the Quick Start guide
2. Customize tests for your needs
3. Add your own test scenarios
4. Deploy to showcase your skills
5. Share with potential employers

**Happy Testing!** 🚀
\`\`\`

\`\`\`
