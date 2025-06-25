package utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.JavascriptExecutor;
import org.apache.commons.io.FileUtils;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Screenshot Utilities for Test Documentation and Failure Analysis
 * 
 * Features:
 * - Full page screenshots
 * - Element-specific screenshots
 * - Failure screenshots with timestamps
 * - Screenshot attachment for reports
 * - Custom screenshot naming
 * - Multiple format support
 * 
 * Usage Examples:
 * 1. Full page: ScreenshotUtils.takeScreenshot(driver, "homepage");
 * 2. Element: ScreenshotUtils.takeElementScreenshot(driver, element, "login_button");
 * 3. Failure: ScreenshotUtils.takeFailureScreenshot(driver, "test_failed");
 */
public class ScreenshotUtils {
    
    private WebDriver driver;
    private static final String SCREENSHOT_DIR = "test-output/screenshots/";
    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
    
    /**
     * Constructor
     * @param driver WebDriver instance
     */
    public ScreenshotUtils(WebDriver driver) {
        this.driver = driver;
        createScreenshotDirectory();
    }
    
    /**
     * Create screenshot directory if it doesn't exist
     */
    private void createScreenshotDirectory() {
        File directory = new File(SCREENSHOT_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }
    
    /**
     * Take full page screenshot
     * @param fileName Screenshot file name (without extension)
     * @return Screenshot file path
     */
    public String takeScreenshot(String fileName) {
        try {
            TakesScreenshot takesScreenshot = (TakesScreenshot) driver;
            File sourceFile = takesScreenshot.getScreenshotAs(OutputType.FILE);
            
            String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
            String fullFileName = fileName + "_" + timestamp + ".png";
            File destFile = new File(SCREENSHOT_DIR + fullFileName);
            
            FileUtils.copyFile(sourceFile, destFile);
            
            System.out.println("📸 Screenshot saved: " + destFile.getAbsolutePath());
            return destFile.getAbsolutePath();
        } catch (IOException e) {
            throw new RuntimeException("Failed to take screenshot: " + fileName, e);
        }
    }
    
    /**
     * Take screenshot with custom path
     * @param fileName Screenshot file name
     * @param customPath Custom directory path
     * @return Screenshot file path
     */
    public String takeScreenshot(String fileName, String customPath) {
        try {
            // Create custom directory if it doesn't exist
            File directory = new File(customPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            TakesScreenshot takesScreenshot = (TakesScreenshot) driver;
            File sourceFile = takesScreenshot.getScreenshotAs(OutputType.FILE);
            
            String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
            String fullFileName = fileName + "_" + timestamp + ".png";
            File destFile = new File(customPath + "/" + fullFileName);
            
            FileUtils.copyFile(sourceFile, destFile);
            
            System.out.println("📸 Screenshot saved: " + destFile.getAbsolutePath());
            return destFile.getAbsolutePath();
        } catch (IOException e) {
            throw new RuntimeException("Failed to take screenshot: " + fileName, e);
        }
    }
    
    /**
     * Take element screenshot
     * @param element WebElement to capture
     * @param fileName Screenshot file name
     * @return Screenshot file path
     */
    public String takeElementScreenshot(WebElement element, String fileName) {
        try {
            File sourceFile = element.getScreenshotAs(OutputType.FILE);
            
            String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
            String fullFileName = "element_" + fileName + "_" + timestamp + ".png";
            File destFile = new File(SCREENSHOT_DIR + fullFileName);
            
            FileUtils.copyFile(sourceFile, destFile);
            
            System.out.println("📸 Element screenshot saved: " + destFile.getAbsolutePath());
            return destFile.getAbsolutePath();
        } catch (IOException e) {
            throw new RuntimeException("Failed to take element screenshot: " + fileName, e);
        }
    }
    
    /**
     * Take failure screenshot with error details
     * @param testName Test name that failed
     * @param errorMessage Error message
     * @return Screenshot file path
     */
    public String takeFailureScreenshot(String testName, String errorMessage) {
        try {
            String fileName = "FAILED_" + testName;
            String screenshotPath = takeScreenshot(fileName);
            
            // Log failure details
            System.err.println("❌ Test Failed: " + testName);
            System.err.println("💥 Error: " + errorMessage);
            System.err.println("📸 Failure Screenshot: " + screenshotPath);
            
            return screenshotPath;
        } catch (Exception e) {
            System.err.println("Failed to take failure screenshot for: " + testName);
            return null;
        }
    }
    
    /**
     * Take failure screenshot (overloaded method)
     * @param testName Test name that failed
     * @return Screenshot file path
     */
    public String takeFailureScreenshot(String testName) {
        return takeFailureScreenshot(testName, "Test execution failed");
    }
    
    /**
     * Take full page screenshot with scroll
     * @param fileName Screenshot file name
     * @return Screenshot file path
     */
    public String takeFullPageScreenshot(String fileName) {
        try {
            // Get original window size
            JavascriptExecutor js = (JavascriptExecutor) driver;
            Long originalHeight = (Long) js.executeScript("return window.innerHeight");
            Long originalWidth = (Long) js.executeScript("return window.innerWidth");
            
            // Get full page dimensions
            Long pageHeight = (Long) js.executeScript("return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)");
            Long pageWidth = (Long) js.executeScript("return Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth)");
            
            // Set window size to full page size
            driver.manage().window().setSize(new org.openqa.selenium.Dimension(pageWidth.intValue(), pageHeight.intValue()));
            
            // Take screenshot
            String screenshotPath = takeScreenshot("fullpage_" + fileName);
            
            // Restore original window size
            driver.manage().window().setSize(new org.openqa.selenium.Dimension(originalWidth.intValue(), originalHeight.intValue()));
            
            return screenshotPath;
        } catch (Exception e) {
            throw new RuntimeException("Failed to take full page screenshot: " + fileName, e);
        }
    }
    
    /**
     * Take screenshot as Base64 string (useful for reports)
     * @return Base64 encoded screenshot
     */
    public String takeScreenshotAsBase64() {
        try {
            TakesScreenshot takesScreenshot = (TakesScreenshot) driver;
            return takesScreenshot.getScreenshotAs(OutputType.BASE64);
        } catch (Exception e) {
            throw new RuntimeException("Failed to take screenshot as Base64", e);
        }
    }
    
    /**
     * Take screenshot and return as byte array
     * @return Screenshot as byte array
     */
    public byte[] takeScreenshotAsByteArray() {
        try {
            TakesScreenshot takesScreenshot = (TakesScreenshot) driver;
            return takesScreenshot.getScreenshotAs(OutputType.BYTES);
        } catch (Exception e) {
            throw new RuntimeException("Failed to take screenshot as byte array", e);
        }
    }
    
    /**
     * Take screenshot with browser info
     * @param fileName Screenshot file name
     * @param testInfo Additional test information
     * @return Screenshot file path
     */
    public String takeScreenshotWithInfo(String fileName, String testInfo) {
        try {
            // Add browser and test info to page
            JavascriptExecutor js = (JavascriptExecutor) driver;
            String browserInfo = (String) js.executeScript("return navigator.userAgent");
            String currentUrl = driver.getCurrentUrl();
            String pageTitle = driver.getTitle();
            
            // Log information
            System.out.println("📊 Test Info: " + testInfo);
            System.out.println("🌐 URL: " + currentUrl);
            System.out.println("📄 Title: " + pageTitle);
            System.out.println("🔍 Browser: " + browserInfo);
            
            return takeScreenshot(fileName + "_with_info");
        } catch (Exception e) {
            throw new RuntimeException("Failed to take screenshot with info: " + fileName, e);
        }
    }
    
    /**
     * Clean up old screenshots (older than specified days)
     * @param daysOld Number of days
     */
    public static void cleanupOldScreenshots(int daysOld) {
        try {
            File screenshotDir = new File(SCREENSHOT_DIR);
            if (screenshotDir.exists()) {
                File[] files = screenshotDir.listFiles();
                if (files != null) {
                    long cutoffTime = System.currentTimeMillis() - (daysOld * 24 * 60 * 60 * 1000L);
                    
                    for (File file : files) {
                        if (file.lastModified() < cutoffTime) {
                            if (file.delete()) {
                                System.out.println("🗑️ Deleted old screenshot: " + file.getName());
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to cleanup old screenshots: " + e.getMessage());
        }
    }
    
    /**
     * Get screenshot directory path
     * @return Screenshot directory path
     */
    public static String getScreenshotDirectory() {
        return SCREENSHOT_DIR;
    }
}
