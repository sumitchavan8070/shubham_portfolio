package tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
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
        
        // Configure Chrome options
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.setExperimentalOption("useAutomationExtension", false);
        options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
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
            waitUtils.waitForTitleContains("Amazon", 10);
            String title = driver.getTitle();
            
            System.out.println("📄 Page Title: " + title);
            Assert.assertTrue(title.contains("Amazon"), "Amazon title verification failed");
            
            // Take screenshot for documentation
            screenshotUtils.takeScreenshot("amazon_homepage");
            
            // Take a small pause to show the page
            Thread.sleep(2000);
            
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
            WebElement searchBox = waitUtils.waitForElementToBeClickable(By.id("twotabsearchtextbox"), 10);
            searchBox.clear();
            searchBox.sendKeys("laptop");
            
            // Click search button
            WebElement searchButton = driver.findElement(By.id("nav-search-submit-button"));
            searchButton.click();
            
            // Wait for search results
            waitUtils.waitForElementPresence(By.cssSelector("[data-component-type='s-search-result']"), 15);
            
            // Verify search results are displayed
            String currentUrl = driver.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("laptop"), "Search results verification failed");
            
            // Take screenshot of search results
            screenshotUtils.takeScreenshot("amazon_search_results");
            
            System.out.println("✅ Product search test passed");
            Thread.sleep(3000); // Show results for 3 seconds
            
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
                By.cssSelector("[data-component-type='s-search-result'] h2 a"), 10
            );
            firstProduct.click();
            
            // Wait for product page to load
            waitUtils.waitForElementPresence(By.id("productTitle"), 15);
            
            // Verify we're on a product page
            WebElement productTitle = driver.findElement(By.id("productTitle"));
            Assert.assertTrue(productTitle.isDisplayed(), "Product page verification failed");
            
            System.out.println("📦 Product: " + productTitle.getText());
            
            // Take screenshot of product page
            screenshotUtils.takeScreenshot("amazon_product_page");
            
            System.out.println("✅ Product navigation test passed");
            
            Thread.sleep(2000);
            
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
