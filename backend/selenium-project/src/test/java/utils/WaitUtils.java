package utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import java.time.Duration;
import java.util.List;
import java.util.function.Function;

/**
 * Custom Wait Strategies Utility Class
 * 
 * Features:
 * - Element visibility waits
 * - Element clickability waits
 * - Page load waits
 * - Dynamic content waits
 * - Custom condition waits
 * - Fluent wait implementations
 * 
 * Usage Examples:
 * 1. Wait for element: WebElement element = WaitUtils.waitForElementPresence(driver, By.id("submit"), 10);
 * 2. Wait for clickable: WaitUtils.waitForElementToBeClickable(driver, element, 15);
 * 3. Wait for page load: WaitUtils.waitForPageLoad(driver, 30);
 * 4. Custom wait: WaitUtils.waitForCustomCondition(driver, customFunction, 20);
 */
public class WaitUtils {
    
    private WebDriver driver;
    private WebDriverWait wait;
    private FluentWait<WebDriver> fluentWait;
    
    /**
     * Constructor
     * @param driver WebDriver instance
     */
    public WaitUtils(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.fluentWait = new FluentWait<>(driver)
                .withTimeout(Duration.ofSeconds(30))
                .pollingEvery(Duration.ofSeconds(1))
                .ignoring(NoSuchElementException.class);
    }
    
    /**
     * Wait for element to be present in DOM
     * @param locator By locator
     * @param timeoutInSeconds Timeout in seconds
     * @return WebElement
     */
    public WebElement waitForElementPresence(By locator, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.presenceOfElementLocated(locator));
        } catch (TimeoutException e) {
            throw new RuntimeException("Element not found within " + timeoutInSeconds + " seconds: " + locator, e);
        }
    }
    
    /**
     * Wait for element to be visible
     * @param locator By locator
     * @param timeoutInSeconds Timeout in seconds
     * @return WebElement
     */
    public WebElement waitForElementVisibility(By locator, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        } catch (TimeoutException e) {
            throw new RuntimeException("Element not visible within " + timeoutInSeconds + " seconds: " + locator, e);
        }
    }
    
    /**
     * Wait for element to be visible
     * @param element WebElement
     * @param timeoutInSeconds Timeout in seconds
     * @return WebElement
     */
    public WebElement waitForElementVisibility(WebElement element, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.visibilityOf(element));
        } catch (TimeoutException e) {
            throw new RuntimeException("Element not visible within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Wait for element to be clickable
     * @param locator By locator
     * @param timeoutInSeconds Timeout in seconds
     * @return WebElement
     */
    public WebElement waitForElementToBeClickable(By locator, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.elementToBeClickable(locator));
        } catch (TimeoutException e) {
            throw new RuntimeException("Element not clickable within " + timeoutInSeconds + " seconds: " + locator, e);
        }
    }
    
    /**
     * Wait for element to be clickable
     * @param element WebElement
     * @param timeoutInSeconds Timeout in seconds
     * @return WebElement
     */
    public WebElement waitForElementToBeClickable(WebElement element, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.elementToBeClickable(element));
        } catch (TimeoutException e) {
            throw new RuntimeException("Element not clickable within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Wait for all elements to be present
     * @param locator By locator
     * @param timeoutInSeconds Timeout in seconds
     * @return List of WebElements
     */
    public List<WebElement> waitForAllElementsPresence(By locator, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(locator));
        } catch (TimeoutException e) {
            throw new RuntimeException("Elements not found within " + timeoutInSeconds + " seconds: " + locator, e);
        }
    }
    
    /**
     * Wait for text to be present in element
     * @param locator By locator
     * @param text Expected text
     * @param timeoutInSeconds Timeout in seconds
     * @return boolean
     */
    public boolean waitForTextToBePresentInElement(By locator, String text, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
        } catch (TimeoutException e) {
            throw new RuntimeException("Text '" + text + "' not present in element within " + timeoutInSeconds + " seconds: " + locator, e);
        }
    }
    
    /**
     * Wait for element to be invisible
     * @param locator By locator
     * @param timeoutInSeconds Timeout in seconds
     * @return boolean
     */
    public boolean waitForElementToBeInvisible(By locator, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
        } catch (TimeoutException e) {
            throw new RuntimeException("Element still visible after " + timeoutInSeconds + " seconds: " + locator, e);
        }
    }
    
    /**
     * Wait for page title to contain text
     * @param title Expected title text
     * @param timeoutInSeconds Timeout in seconds
     * @return boolean
     */
    public boolean waitForTitleContains(String title, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.titleContains(title));
        } catch (TimeoutException e) {
            throw new RuntimeException("Title does not contain '" + title + "' within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Wait for page to load completely
     * @param timeoutInSeconds Timeout in seconds
     */
    public void waitForPageLoad(int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            customWait.until(webDriver -> ((JavascriptExecutor) webDriver)
                    .executeScript("return document.readyState").equals("complete"));
        } catch (TimeoutException e) {
            throw new RuntimeException("Page did not load completely within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Wait for jQuery to load (if present)
     * @param timeoutInSeconds Timeout in seconds
     */
    public void waitForJQueryLoad(int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            customWait.until(webDriver -> {
                JavascriptExecutor js = (JavascriptExecutor) webDriver;
                return (Boolean) js.executeScript("return typeof jQuery !== 'undefined' && jQuery.active === 0");
            });
        } catch (TimeoutException e) {
            throw new RuntimeException("jQuery did not load within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Wait for Angular to load (if present)
     * @param timeoutInSeconds Timeout in seconds
     */
    public void waitForAngularLoad(int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            customWait.until(webDriver -> {
                JavascriptExecutor js = (JavascriptExecutor) webDriver;
                return (Boolean) js.executeScript("return typeof angular !== 'undefined' && angular.element(document).injector().get('$http').pendingRequests.length === 0");
            });
        } catch (TimeoutException e) {
            throw new RuntimeException("Angular did not load within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Fluent wait for custom condition
     * @param condition Custom condition function
     * @param timeoutInSeconds Timeout in seconds
     * @param pollingIntervalInSeconds Polling interval in seconds
     * @return Result of condition function
     */
    public <T> T waitForCustomCondition(Function<WebDriver, T> condition, int timeoutInSeconds, int pollingIntervalInSeconds) {
        try {
            FluentWait<WebDriver> customFluentWait = new FluentWait<>(driver)
                    .withTimeout(Duration.ofSeconds(timeoutInSeconds))
                    .pollingEvery(Duration.ofSeconds(pollingIntervalInSeconds))
                    .ignoring(NoSuchElementException.class);
            
            return customFluentWait.until(condition);
        } catch (TimeoutException e) {
            throw new RuntimeException("Custom condition not met within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Wait for element attribute to contain value
     * @param locator By locator
     * @param attribute Attribute name
     * @param value Expected attribute value
     * @param timeoutInSeconds Timeout in seconds
     * @return boolean
     */
    public boolean waitForElementAttributeContains(By locator, String attribute, String value, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.attributeContains(locator, attribute, value));
        } catch (TimeoutException e) {
            throw new RuntimeException("Element attribute '" + attribute + "' does not contain '" + value + "' within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Wait for URL to contain text
     * @param urlFraction Expected URL fragment
     * @param timeoutInSeconds Timeout in seconds
     * @return boolean
     */
    public boolean waitForUrlContains(String urlFraction, int timeoutInSeconds) {
        try {
            WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            return customWait.until(ExpectedConditions.urlContains(urlFraction));
        } catch (TimeoutException e) {
            throw new RuntimeException("URL does not contain '" + urlFraction + "' within " + timeoutInSeconds + " seconds", e);
        }
    }
    
    /**
     * Hard wait (Thread.sleep) - use sparingly
     * @param seconds Seconds to wait
     */
    public static void hardWait(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Hard wait interrupted", e);
        }
    }
}
