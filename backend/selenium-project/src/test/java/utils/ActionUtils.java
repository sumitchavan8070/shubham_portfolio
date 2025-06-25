package utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.Keys;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

/**
 * Selenium Actions Utility Class
 * 
 * Features:
 * - Mouse hover operations
 * - Drag and drop functionality
 * - Keyboard shortcuts and key combinations
 * - Right-click context menu operations
 * - Double-click actions
 * - Element interactions with Actions class
 * 
 * Usage Examples:
 * 1. Hover: ActionUtils.hoverOverElement(driver, element);
 * 2. Drag & Drop: ActionUtils.dragAndDrop(driver, source, target);
 * 3. Right Click: ActionUtils.rightClick(driver, element);
 * 4. Key Combo: ActionUtils.pressKeysCombination(driver, Keys.CONTROL, "a");
 */
public class ActionUtils {
    
    private static Actions actions;
    private static WebDriverWait wait;
    
    /**
     * Initialize Actions class
     * @param driver WebDriver instance
     */
    private static void initializeActions(WebDriver driver) {
        if (actions == null) {
            actions = new Actions(driver);
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        }
    }
    
    /**
     * Hover over an element
     * @param driver WebDriver instance
     * @param element WebElement to hover over
     */
    public static void hoverOverElement(WebDriver driver, WebElement element) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.visibilityOf(element));
            actions.moveToElement(element).perform();
            Thread.sleep(500); // Small pause to ensure hover effect
        } catch (Exception e) {
            throw new RuntimeException("Failed to hover over element", e);
        }
    }
    
    /**
     * Hover over element by locator
     * @param driver WebDriver instance
     * @param locator By locator
     */
    public static void hoverOverElement(WebDriver driver, By locator) {
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        hoverOverElement(driver, element);
    }
    
    /**
     * Drag and drop from source to target element
     * @param driver WebDriver instance
     * @param sourceElement Source element
     * @param targetElement Target element
     */
    public static void dragAndDrop(WebDriver driver, WebElement sourceElement, WebElement targetElement) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.visibilityOf(sourceElement));
            wait.until(ExpectedConditions.visibilityOf(targetElement));
            
            actions.dragAndDrop(sourceElement, targetElement).perform();
            Thread.sleep(1000); // Wait for drag and drop to complete
        } catch (Exception e) {
            throw new RuntimeException("Failed to perform drag and drop", e);
        }
    }
    
    /**
     * Drag and drop by offset
     * @param driver WebDriver instance
     * @param element Element to drag
     * @param xOffset X offset
     * @param yOffset Y offset
     */
    public static void dragAndDropByOffset(WebDriver driver, WebElement element, int xOffset, int yOffset) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.visibilityOf(element));
            actions.dragAndDropBy(element, xOffset, yOffset).perform();
            Thread.sleep(1000);
        } catch (Exception e) {
            throw new RuntimeException("Failed to perform drag and drop by offset", e);
        }
    }
    
    /**
     * Right-click on an element
     * @param driver WebDriver instance
     * @param element WebElement to right-click
     */
    public static void rightClick(WebDriver driver, WebElement element) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.visibilityOf(element));
            actions.contextClick(element).perform();
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Failed to right-click on element", e);
        }
    }
    
    /**
     * Double-click on an element
     * @param driver WebDriver instance
     * @param element WebElement to double-click
     */
    public static void doubleClick(WebDriver driver, WebElement element) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.visibilityOf(element));
            actions.doubleClick(element).perform();
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Failed to double-click on element", e);
        }
    }
    
    /**
     * Click and hold an element
     * @param driver WebDriver instance
     * @param element WebElement to click and hold
     */
    public static void clickAndHold(WebDriver driver, WebElement element) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.visibilityOf(element));
            actions.clickAndHold(element).perform();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click and hold element", e);
        }
    }
    
    /**
     * Release held element
     * @param driver WebDriver instance
     */
    public static void release(WebDriver driver) {
        initializeActions(driver);
        try {
            actions.release().perform();
        } catch (Exception e) {
            throw new RuntimeException("Failed to release element", e);
        }
    }
    
    /**
     * Press key combination (e.g., Ctrl+A, Ctrl+C, Ctrl+V)
     * @param driver WebDriver instance
     * @param keys Keys to press
     */
    public static void pressKeysCombination(WebDriver driver, Keys... keys) {
        initializeActions(driver);
        try {
            actions.keyDown(keys[0]);
            for (int i = 1; i < keys.length; i++) {
                actions.sendKeys(keys[i].toString());
            }
            actions.keyUp(keys[0]).perform();
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Failed to press key combination", e);
        }
    }
    
    /**
     * Press key combination with string (e.g., Ctrl+A)
     * @param driver WebDriver instance
     * @param modifierKey Modifier key (Ctrl, Alt, Shift)
     * @param key Key to press with modifier
     */
    public static void pressKeysCombination(WebDriver driver, Keys modifierKey, String key) {
        initializeActions(driver);
        try {
            actions.keyDown(modifierKey)
                   .sendKeys(key)
                   .keyUp(modifierKey)
                   .perform();
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Failed to press key combination", e);
        }
    }
    
    /**
     * Send keys to an element
     * @param driver WebDriver instance
     * @param element WebElement to send keys to
     * @param text Text to send
     */
    public static void sendKeys(WebDriver driver, WebElement element, String text) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.visibilityOf(element));
            actions.click(element).sendKeys(text).perform();
        } catch (Exception e) {
            throw new RuntimeException("Failed to send keys to element", e);
        }
    }
    
    /**
     * Clear text field and enter new text
     * @param driver WebDriver instance
     * @param element WebElement (input field)
     * @param text New text to enter
     */
    public static void clearAndType(WebDriver driver, WebElement element, String text) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.visibilityOf(element));
            actions.click(element)
                   .keyDown(Keys.CONTROL)
                   .sendKeys("a")
                   .keyUp(Keys.CONTROL)
                   .sendKeys(text)
                   .perform();
        } catch (Exception e) {
            throw new RuntimeException("Failed to clear and type in element", e);
        }
    }
    
    /**
     * Scroll to element using Actions
     * @param driver WebDriver instance
     * @param element WebElement to scroll to
     */
    public static void scrollToElement(WebDriver driver, WebElement element) {
        initializeActions(driver);
        try {
            actions.moveToElement(element).perform();
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Failed to scroll to element", e);
        }
    }
    
    /**
     * Move to element and click
     * @param driver WebDriver instance
     * @param element WebElement to move to and click
     */
    public static void moveToElementAndClick(WebDriver driver, WebElement element) {
        initializeActions(driver);
        try {
            wait.until(ExpectedConditions.elementToBeClickable(element));
            actions.moveToElement(element).click().perform();
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Failed to move to element and click", e);
        }
    }
    
    /**
     * Perform chain of actions
     * @param driver WebDriver instance
     * @param actionChain Custom action chain
     */
    public static void performActionChain(WebDriver driver, Actions actionChain) {
        try {
            actionChain.perform();
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Failed to perform action chain", e);
        }
    }
}
