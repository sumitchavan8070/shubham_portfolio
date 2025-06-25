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

// Rest of your existing endpoints...
// (Keep all other endpoints from your original server.js)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🖥️  Environment: ${isHeadless ? "Headless (AWS EC2)" : "Desktop"}`)
  console.log(`📹 Recording: ${isHeadless ? "FFmpeg + Xvfb" : "GNOME Shell"}`)
  console.log(`📊 Test reports: http://localhost:${PORT}/test-reports`)
})
