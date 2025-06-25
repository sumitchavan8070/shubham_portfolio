#!/bin/bash

# Setup script for headless screen recording on AWS EC2
# Run this script after launching your EC2 instance

echo "🚀 Setting up headless screen recording environment..."

# Update system
sudo apt-get update -y

# Install required packages
echo "📦 Installing required packages..."
sudo apt-get install -y \
    xvfb \
    ffmpeg \
    x11-utils \
    xauth \
    python3-pip \
    nodejs \
    npm \
    openjdk-11-jdk \
    maven \
    google-chrome-stable \
    wget \
    curl

# Install Chrome if not already installed
if ! command -v google-chrome &> /dev/null; then
    echo "🌐 Installing Google Chrome..."
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt-get update -y
    sudo apt-get install -y google-chrome-stable
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Setup Maven project
echo "☕ Setting up Maven project..."
cd selenium-project
mvn clean compile test-compile
cd ..

# Create segments directory
mkdir -p segments

# Set permissions
chmod +x record-headless.py

# Test virtual display
echo "🖥️ Testing virtual display..."
Xvfb :99 -screen 0 1920x1080x24 &
XVFB_PID=$!
sleep 2

export DISPLAY=:99
if xdpyinfo > /dev/null 2>&1; then
    echo "✅ Virtual display working correctly"
else
    echo "❌ Virtual display test failed"
fi

# Cleanup test
kill $XVFB_PID

echo "🎉 Setup complete! Your EC2 instance is ready for headless automation."
echo ""
echo "📋 Next steps:"
echo "1. Update server.js to use record-headless.py"
echo "2. Start your application: npm start"
echo "3. Test the automation portfolio"
