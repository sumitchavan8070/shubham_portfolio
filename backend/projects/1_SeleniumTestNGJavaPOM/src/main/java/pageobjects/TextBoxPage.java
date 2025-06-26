package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.*;

public class TextBoxPage {

    public TextBoxPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    @FindBy(id = "userName")
    WebElement fullNameInput;

    @FindBy(id = "userEmail")
    WebElement emailInput;

    @FindBy(id = "currentAddress")
    WebElement currentAddressInput;

    @FindBy(id = "permanentAddress")
    WebElement permanentAddressInput;

    @FindBy(id = "submit")
    WebElement submitBtn;

    @FindBy(id = "name")
    WebElement outputName;

    public void fillForm(String name, String email, String current, String permanent) {
        fullNameInput.sendKeys(name);
        emailInput.sendKeys(email);
        currentAddressInput.sendKeys(current);
        permanentAddressInput.sendKeys(permanent);
        submitBtn.click();
    }

    public String getNameResult() {
        return outputName.getText();
    }
}
