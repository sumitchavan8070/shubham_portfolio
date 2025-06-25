const express = require("express")
const { spawn } = require("child_process")
const path = require("path")
const fs = require("fs")
const cors = require("cors")
const app = express()
const PORT = process.env.PORT || 5000

let recordingProcess = null
const testExecutionProcesses = new Map()
let isRecording = false
const runningTests = new Set()

// Detect if running in headless environment
const isHeadless = !process.env.DISPLAY || process.env.AWS_EXECUTION_ENV || process.env.NODE_ENV === "production"

app.use(cors())
app.use(express.json())
app.use("/segments", express.static(path.join(__dirname, "segments")))
app.use("/test-reports", express.static(path.join(__dirname, "selenium-project/test-output")))

// Health check endpoint
app.get("/status", (req, res) => {
  res.json({
    isRecording,
    isTestRunning: runningTests.size > 0,
    runningTests: Array.from(runningTests),
    timestamp: new Date().toISOString(),
    environment: isHeadless ? "headless" : "desktop",
    server: "AWS EC2", // Add server info
  })
})

// Start recording - automatically detect environment
app.post("/start-recording", (req, res) => {
  if (isRecording) {
    return res.status(400).json({ error: "Recording already in progress" })
  }

  // Clear previous recording
  const finalOutput = path.join(__dirname, "segments", "recording.mp4")
  if (fs.existsSync(finalOutput)) {
    fs.unlinkSync(finalOutput)
  }

  isRecording = true

  // Choose recording script based on environment
  const recordScript = isHeadless ? "record-headless.py" : "record.py"

  console.log(`Starting recording with ${recordScript} (${isHeadless ? "headless" : "desktop"} mode)`)

  recordingProcess = spawn("python3", [recordScript], {
    cwd: __dirname,
    stdio: ["pipe", "pipe", "pipe"],
    env: {
      ...process.env,
      DISPLAY: isHeadless ? ":99" : process.env.DISPLAY || ":0",
    },
  })

  recordingProcess.stdout.on("data", (data) => {
    console.log(`Recording: ${data}`)
  })

  recordingProcess.stderr.on("data", (data) => {
    console.error(`Recording Error: ${data}`)
  })

  recordingProcess.on("close", (code) => {
    isRecording = false
    console.log(`Recording process exited with code ${code}`)
  })

  res.json({
    message: "Recording started",
    environment: isHeadless ? "headless" : "desktop",
    script: recordScript,
  })
})

// Execute individual test with environment-aware Chrome options
app.post("/execute-individual-test", (req, res) => {
  const { testName } = req.body

  if (!testName) {
    return res.status(400).json({ error: "Test name is required" })
  }

  if (runningTests.has(testName)) {
    return res.status(400).json({ error: `${testName} is already running` })
  }

  runningTests.add(testName)

  // Start recording automatically when test starts
  if (!isRecording) {
    const finalOutput = path.join(__dirname, "segments", "recording.mp4")
    if (fs.existsSync(finalOutput)) {
      fs.unlinkSync(finalOutput)
    }

    isRecording = true
    const recordScript = isHeadless ? "record-headless.py" : "record.py"

    recordingProcess = spawn("python3", [recordScript], {
      cwd: __dirname,
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        DISPLAY: isHeadless ? ":99" : process.env.DISPLAY || ":0",
      },
    })

    recordingProcess.stdout.on("data", (data) => {
      console.log(`Recording: ${data}`)
    })

    recordingProcess.stderr.on("data", (data) => {
      console.error(`Recording Error: ${data}`)
    })

    recordingProcess.on("close", (code) => {
      isRecording = false
      console.log(`Recording process exited with code ${code}`)
    })
  }

  // Execute Maven test with headless Chrome options
  const testClass = testName.replace(".java", "")
  const mavenArgs = [
    "test",
    `-Dtest=${testClass}`,
    `-Dheadless=${isHeadless}`, // Pass headless flag to tests
  ]

  const testExecutionProcess = spawn("mvn", mavenArgs, {
    cwd: path.join(__dirname, "selenium-project"),
    stdio: ["pipe", "pipe", "pipe"],
    env: {
      ...process.env,
      DISPLAY: isHeadless ? ":99" : process.env.DISPLAY || ":0",
    },
  })

  testExecutionProcesses.set(testName, testExecutionProcess)

  let output = ""
  let errorOutput = ""

  testExecutionProcess.stdout.on("data", (data) => {
    const message = data.toString()
    output += message
    console.log(`Maven (${testName}): ${message}`)
  })

  testExecutionProcess.stderr.on("data", (data) => {
    const message = data.toString()
    errorOutput += message
    console.error(`Maven Error (${testName}): ${message}`)
  })

  testExecutionProcess.on("close", (code) => {
    runningTests.delete(testName)
    testExecutionProcesses.delete(testName)

    // Stop recording when no tests are running
    if (runningTests.size === 0 && isRecording && recordingProcess) {
      recordingProcess.kill("SIGTERM") // Use SIGTERM for clean shutdown
    }

    console.log(`Test execution completed for ${testName} with code ${code}`)
  })

  res.json({
    message: `${testName} execution started`,
    testName,
    environment: isHeadless ? "headless" : "desktop",
  })
})

// Add environment info endpoint
app.get("/environment", (req, res) => {
  res.json({
    isHeadless,
    display: process.env.DISPLAY || "none",
    platform: process.platform,
    nodeEnv: process.env.NODE_ENV,
    awsEnv: process.env.AWS_EXECUTION_ENV || "none",
  })
})


// Get available test files (filtered by TestConfig)
app.get("/test-files", (req, res) => {
  const testDir = path.join(__dirname, "selenium-project/src/test/java/tests")
  try {
    // Read TestConfig to get visible tests
    const configPath = path.join(__dirname, "selenium-project/src/test/java/config/TestConfig.java")
    let visibleTests = ["AmazonTest.java", "RedBusTest.java"] // Default fallback

    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, "utf8")
      // Extract visible tests from config (simple parsing)
      const visibleTestsMatch = configContent.match(/VISIBLE_TESTS = Arrays\.asList$$([\s\S]*?)$$/)
      if (visibleTestsMatch) {
        visibleTests = visibleTestsMatch[1]
          .split(",")
          .map((test) => test.trim().replace(/"/g, ""))
          .filter((test) => test && !test.startsWith("//"))
      }
    }

    const files = fs
      .readdirSync(testDir)
      .filter((file) => file.endsWith(".java") && visibleTests.includes(file))
      .map((file) => {
        const content = fs.readFileSync(path.join(testDir, file), "utf8")

        // Get description from TestConfig
        let description = "Selenium WebDriver automation test"
        if (fs.existsSync(configPath)) {
          const configContent = fs.readFileSync(configPath, "utf8")
          const descMatch = configContent.match(new RegExp(`case "${file}":[\\s\\S]*?return "([^"]+)"`))
          if (descMatch) {
            description = descMatch[1]
          }
        }

        return {
          name: file,
          content: content,
          description: description,
        }
      })
    res.json(files)
  } catch (error) {
    res.status(500).json({ error: "Failed to read test files" })
  }
})

// Get utility files
app.get("/utility-files", (req, res) => {
  const utilsDir = path.join(__dirname, "selenium-project/src/test/java/utils")
  try {
    if (!fs.existsSync(utilsDir)) {
      return res.json([])
    }

    const files = fs
      .readdirSync(utilsDir)
      .filter((file) => file.endsWith(".java"))
      .map((file) => {
        const content = fs.readFileSync(path.join(utilsDir, file), "utf8")

        // Get description based on file name
        let description = "Utility class for automation testing"
        switch (file) {
          case "ExcelUtils.java":
            description = "Excel file operations - Read/Write data, cell formatting, data-driven testing support"
            break
          case "ActionUtils.java":
            description =
              "Selenium Actions utility - Mouse hover, drag & drop, keyboard shortcuts, element interactions"
            break
          case "WaitUtils.java":
            description = "Custom wait strategies - Element visibility, page load, dynamic content handling"
            break
          case "ScreenshotUtils.java":
            description = "Screenshot utilities - Full page capture, element screenshots, failure screenshots"
            break
        }

        return {
          name: file,
          content: content,
          description: description,
        }
      })
    res.json(files)
  } catch (error) {
    res.status(500).json({ error: "Failed to read utility files" })
  }
})

// Get test suites
app.get("/test-suites", (req, res) => {
  const suiteDir = path.join(__dirname, "selenium-project")
  try {
    const suites = fs
      .readdirSync(suiteDir)
      .filter((file) => file.startsWith("testng") && file.endsWith(".xml"))
      .map((file) => ({
        name: file,
        displayName: file.replace("testng-", "").replace(".xml", "").replace("testng", "Amazon"),
      }))
    res.json(suites)
  } catch (error) {
    res.status(500).json({ error: "Failed to read test suites" })
  }
})


// Rest of your existing endpoints...
// (Keep all other endpoints from your original server.js)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🖥️  Environment: ${isHeadless ? "Headless (AWS EC2)" : "Desktop"}`)
  console.log(`📹 Recording: ${isHeadless ? "FFmpeg + Xvfb" : "GNOME Shell"}`)
  console.log(`📊 Test reports: http://localhost:${PORT}/test-reports`)
})
