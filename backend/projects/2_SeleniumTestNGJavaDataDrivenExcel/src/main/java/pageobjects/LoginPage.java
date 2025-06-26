
package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.*;

public class LoginPage {
    public LoginPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "username")
    WebElement usernameInput;

    @FindBy(id = "password")
    WebElement passwordInput;

    @FindBy(id = "submit")
    WebElement loginBtn;

    @FindBy(xpath = "//h1[contains(text(), 'Logged')]")
    WebElement successMsg;

    public void login(String username, String password) {
        usernameInput.sendKeys(username);
        passwordInput.sendKeys(password);
        loginBtn.click();
    }

    public boolean isLoginSuccessful() {
        return successMsg.isDisplayed();
    }
}
