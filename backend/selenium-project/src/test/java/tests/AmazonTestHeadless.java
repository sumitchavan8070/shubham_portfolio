package tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.*;
import utils.WaitUtils;
import utils.ScreenshotUtils;
import java.time.Duration;

public class AmazonTest {
    private WebDriver driver;
    private WebDriverWait wait;
    private WaitUtils waitUtils;
    private ScreenshotUtils screenshotUtils;

    @BeforeClass
    public void setUp() {
        // Setup ChromeDriver using WebDriverManager
        WebDriverManager.chromedriver().setup();
        
        // Configure Chrome options for both desktop and headless
        ChromeOptions options = new ChromeOptions();
        
        // Check if running in headless mode
        String headlessMode = System.getProperty("headless", "false");
        boolean isHeadless = "true".equals(headlessMode) || 
                           System.getenv("DISPLAY") == null ||
                           ":99".equals(System.getenv("DISPLAY"));
        
        if (isHeadless) {
            System.out.println("🖥️ Running in HEADLESS mode (AWS EC2)");
            options.addArguments("--headless=new");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("--disable-gpu");
            options.addArguments("--remote-debugging-port=9222");
            options.addArguments("--window-size=1920,1080");
        } else {
            System.out.println("🖥️ Running in DESKTOP mode");
            options.addArguments("--start-maximized");
        }
        
        // Common options for both modes
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-extensions");
        options.addArguments("--disable-plugins");
        options.addArguments("--disable-images"); // Faster loading
        options.setExperimentalOption("useAutomationExtension", false);
        options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15)); // Increased timeout for EC2
        waitUtils = new WaitUtils(driver);
        screenshotUtils = new ScreenshotUtils(driver);
        
        System.out.println("✅ Browser setup completed");
    }

    @Test(priority = 1, description = "Launch Amazon and verify title")
    public void testAmazonLaunch() {
        try {
            System.out.println("🚀 Launching Amazon.com...");
            driver.get("https://www.amazon.com");
            
            // Wait for page to load and verify title
            waitUtils.waitForTitleContains("Amazon", 15); // Increased timeout
            String title = driver.getTitle();
            
            System.out.println("📄 Page Title: " + title);
            Assert.assertTrue(title.contains("Amazon"), "Amazon title verification failed");
            
            // Take screenshot for documentation
            screenshotUtils.takeScreenshot("amazon_homepage");
            
            // Take a small pause to show the page
            Thread.sleep(3000); // Increased for better recording
            
            System.out.println("✅ Amazon launch test passed");
        } catch (Exception e) {
            screenshotUtils.takeScreenshot("amazon_launch_failed");
            System.err.println("❌ Test failed: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Test(priority = 2, description = "Search for a product")
    public void testProductSearch() {
        try {
            System.out.println("🔍 Searching for 'laptop'...");
            
            // Find search box and enter search term
            WebElement searchBox = waitUtils.waitForElementToBeClickable(By.id("twotabsearchtextbox"), 15);
            searchBox.clear();
            searchBox.sendKeys("laptop");
            Thread.sleep(1000);
            
            // Click search button
            WebElement searchButton = driver.findElement(By.id("nav-search-submit-button"));
            searchButton.click();
            
            // Wait for search results
            waitUtils.waitForElementPresence(By.cssSelector("[data-component-type='s-search-result']"), 20);
            
            // Verify search results are displayed
            String currentUrl = driver.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("laptop"), "Search results verification failed");
            
            // Take screenshot of search results
            screenshotUtils.takeScreenshot("amazon_search_results");
            
            System.out.println("✅ Product search test passed");
            Thread.sleep(4000); // Show results longer for recording
            
        } catch (Exception e) {
            screenshotUtils.takeScreenshot("amazon_search_failed");
            System.err.println("❌ Search test failed: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Test(priority = 3, description = "Navigate to first product")
    public void testProductNavigation() {
        try {
            System.out.println("📱 Clicking on first product...");
            
            // Click on first product
            WebElement firstProduct = waitUtils.waitForElementToBeClickable(
                By.cssSelector("[data-component-type='s-search-result'] h2 a"), 15
            );
            firstProduct.click();
            
            // Wait for product page to load
            waitUtils.waitForElementPresence(By.id("productTitle"), 20);
            
            // Verify we're on a product page
            WebElement productTitle = driver.findElement(By.id("productTitle"));
            Assert.assertTrue(productTitle.isDisplayed(), "Product page verification failed");
            
            System.out.println("📦 Product: " + productTitle.getText());
            
            // Take screenshot of product page
            screenshotUtils.takeScreenshot("amazon_product_page");
            
            System.out.println("✅ Product navigation test passed");
            
            Thread.sleep(3000);
            
        } catch (Exception e) {
            screenshotUtils.takeScreenshot("amazon_navigation_failed");
            System.err.println("❌ Navigation test failed: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            System.out.println("🔚 Closing browser...");
            driver.quit();
            System.out.println("✅ Test execution completed");
        }
    }
}
