# Frontend - Automation Test Portfolio

Modern Next.js frontend application showcasing automation testing capabilities with real-time execution monitoring, professional profile, and dark/light mode theming.

## 🏗️ Project Structure

\`\`\`
frontend/
├── app/
│   ├── page.tsx                 # Main portfolio page
│   ├── layout.tsx               # Root layout with theme provider
│   └── globals.css              # Global styles and CSS variables
├── components/
│   ├── ui/                      # Custom UI components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── badge.tsx            # Badge component
│   │   └── alert.tsx            # Alert component
│   ├── theme-provider.tsx       # Theme context provider
│   └── theme-toggle.tsx         # Dark/light mode toggle
├── lib/
│   └── utils.ts                 # Utility functions (cn helper)
├── public/
│   └── profile.jpeg             # Profile photo
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
\`\`\`

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager

### Installation

\`\`\`bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

### Build for Production

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

## 🎨 Features

### 🖥️ Main Dashboard
- **Professional Profile**: Personal information, photo, and experience
- **Real-time Status**: Live status badges showing test and recording states
- **Interactive Controls**: Start/stop test execution with visual feedback
- **Theme Toggle**: Dark/light mode switching
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📊 Content Sections
1. **Profile Section**: Professional background and contact information
2. **Experience Timeline**: Work history with visual indicators
3. **Test Selection**: Choose between different automation scripts
4. **Side-by-Side Layout**: Test code and recording displayed together
5. **Skills Showcase**: Technical capabilities and expertise

### 🎯 Interactive Components
- **Test Selection Buttons**: Switch between different test scripts
- **Suite Selector**: Choose test suites to execute
- **Control Buttons**: Execute tests and manage recordings
- **Status Indicators**: Real-time system status
- **Theme Toggle**: Seamless dark/light mode switching

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### UI Components
- **Custom Components**: Badge, Alert, and utility components
- **Radix UI**: Headless component primitives
- **Lucide React**: Beautiful icon library
- **Class Variance Authority**: Component variant management
- **Next Themes**: Theme switching functionality

### Styling & Design
- **CSS Variables**: Dynamic theming support
- **Responsive Grid**: Mobile-first design approach
- **Animation**: Smooth transitions and interactions
- **Backdrop Blur**: Modern glass-morphism effects

## 📱 Component Architecture

### Main Page Component (\`app/page.tsx\`)
\`\`\`typescript
interface TestFile {
  name: string
  content: string
  description: string
}

interface TestStatus {
  isRecording: boolean
  isTestRunning: boolean
  timestamp: string
}

interface TestSuite {
  name: string
  displayName: string
}
\`\`\`

### Key Functions
- \`fetchTestFiles()\`: Load test code from backend API
- \`fetchTestSuites()\`: Get available test suites
- \`checkStatus()\`: Poll backend for real-time status updates
- \`executeTest()\`: Trigger test execution with recording
- \`stopExecution()\`: Stop running tests and recording

### State Management
- **React Hooks**: useState, useEffect for local state
- **Real-time Polling**: 2-second intervals for status updates
- **Theme Context**: Next-themes for dark/light mode
- **Error Handling**: Graceful error recovery and user feedback

## 🎨 Design System

### Color Palette
\`\`\`css
/* Light Mode */
--primary: 221.2 83.2% 53.3%;           /* Blue */
--secondary: 210 40% 96%;               /* Light Gray */
--destructive: 0 84.2% 60.2%;           /* Red */
--background: 0 0% 100%;                /* White */

/* Dark Mode */
--primary: 217.2 91.2% 59.8%;           /* Light Blue */
--background: 222.2 84% 4.9%;           /* Dark Gray */
--foreground: 210 40% 98%;              /* Light Text */
\`\`\`

### Typography
- **Headings**: Bold, large text for titles and sections
- **Body Text**: Clean, readable Inter font
- **Code Display**: Monospace font with syntax highlighting
- **UI Elements**: System fonts for interface components

### Layout Principles
- **Card-based Design**: Organized content sections with backdrop blur
- **Consistent Spacing**: Uniform margins and padding
- **Visual Hierarchy**: Clear content organization
- **Side-by-Side Layout**: Code and recording displayed together

## 🔄 API Integration

### Backend Communication
\`\`\`typescript
const BACKEND_URL = "http://localhost:5000"

// API Endpoints
GET  /status           // System status
GET  /test-files       // Available test files
GET  /test-suites      // Available test suites
POST /execute-test     // Start test execution
POST /start-recording  // Manual recording control
POST /stop-recording   // Stop recording
\`\`\`

### Real-time Updates
\`\`\`typescript
// Status polling every 2 seconds
useEffect(() => {
  const interval = setInterval(checkStatus, 2000)
  return () => clearInterval(interval)
}, [])
\`\`\`

### Error Handling
- **Network Errors**: Automatic retry and user notification
- **API Timeouts**: Graceful degradation
- **Invalid Responses**: Error boundary protection
- **User Feedback**: Clear error messages and recovery options

## 🌙 Theme System

### Theme Provider Setup
\`\`\`tsx
// app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
\`\`\`

### Theme Toggle Component
\`\`\`tsx
// components/theme-toggle.tsx
const { theme, setTheme } = useTheme()
onClick={() => setTheme(theme === "light" ? "dark" : "light")}
\`\`\`

### CSS Variables
- **Automatic switching** between light and dark themes
- **Smooth transitions** for theme changes
- **System preference** detection
- **Persistent theme** selection

## 📱 Responsive Design

### Breakpoints
\`\`\`css
/* Mobile First Approach */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* 2X large devices */
\`\`\`

### Adaptive Features
- **Flexible Layouts**: Grid and flexbox combinations
- **Responsive Typography**: Scalable text sizes
- **Touch-friendly**: Optimized button sizes and spacing
- **Mobile Navigation**: Collapsible and accessible interface

## 🧪 Development

### Available Scripts
\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
\`\`\`

### Development Workflow
1. **Hot Reload**: Automatic page refresh on changes
2. **TypeScript**: Real-time type checking
3. **ESLint**: Code quality enforcement
4. **Tailwind**: Utility-first styling approach

### Code Organization
- **Components**: Reusable UI components in \`components/ui/\`
- **Utilities**: Helper functions in \`lib/utils.ts\`
- **Styles**: Global styles in \`app/globals.css\`
- **Configuration**: Build and tool configs in root

## 🔧 Configuration

### Environment Variables
\`\`\`bash
# .env.local (create this file)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
\`\`\`

### Tailwind Configuration
\`\`\`typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { /* Custom color palette */ },
      animation: { /* Custom animations */ }
    }
  }
}
\`\`\`

### Next.js Configuration
\`\`\`javascript
// next.config.js
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Dependencies Installation Failed**
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Backend Connection Issues**
- Verify backend server is running on port 5000
- Check CORS configuration in backend
- Ensure no firewall blocking connections

**Theme Not Working**
- Check if \`next-themes\` is properly installed
- Verify ThemeProvider is wrapping the app
- Ensure CSS variables are defined

**Build Errors**
\`\`\`bash
# Check TypeScript errors
npm run build

# Fix linting issues
npm run lint --fix
\`\`\`

### Debug Commands
\`\`\`bash
# Development with detailed logging
npm run dev

# Type checking
npx tsc --noEmit

# Check bundle size
npm run build
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Production deployment
vercel --prod
\`\`\`

### Static Export
\`\`\`bash
# Build static version
npm run build
npm run export
\`\`\`

### Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 📈 Performance Optimization

### Built-in Optimizations
- **Automatic Code Splitting**: Next.js handles bundle splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts optimization
- **CSS Optimization**: Automatic CSS minification

### Custom Optimizations
- **Lazy Loading**: Dynamic imports for heavy components
- **Memoization**: React.memo for expensive components
- **Theme Caching**: Persistent theme selection
- **API Caching**: Efficient data fetching

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint and Prettier configurations
2. **TypeScript**: Use proper type definitions
3. **Components**: Create reusable, accessible components
4. **Testing**: Add tests for new features
5. **Documentation**: Update README for new features

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with detailed description

---

## 🎯 Next Steps

1. **Install Dependencies**: Run \`npm install\`
2. **Start Development**: Run \`npm run dev\`
3. **Customize**: Modify components and styling
4. **Test Integration**: Connect with backend API
5. **Deploy**: Choose your deployment platform

**Happy Coding!** 🚀
