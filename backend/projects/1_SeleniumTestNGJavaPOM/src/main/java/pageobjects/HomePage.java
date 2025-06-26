package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.*;

public class HomePage {

    public HomePage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    @FindBy(xpath = "//h5[text()='Elements']")
    WebElement elementsCard;

    public void clickElementsCard() {
        elementsCard.click();
    }
}
