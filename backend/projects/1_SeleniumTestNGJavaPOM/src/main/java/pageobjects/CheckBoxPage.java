package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.*;

public class CheckBoxPage {

    public CheckBoxPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    @FindBy(xpath = "//span[text()='Check Box']")
    WebElement checkBoxMenu;

    @FindBy(css = ".rct-icon-expand-all")
    WebElement expandAll;

    @FindBy(xpath = "//span[@class='rct-title' and text()='Downloads']")
    WebElement downloadsCheckbox;

    @FindBy(css = "#result")
    WebElement resultOutput;

    public void selectDownloadCheckbox() {
        checkBoxMenu.click();
        expandAll.click();
        downloadsCheckbox.click();
    }

    public String getResultText() {
        return resultOutput.getText();
    }
}
