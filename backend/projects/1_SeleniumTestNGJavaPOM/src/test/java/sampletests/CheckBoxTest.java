package sampletests;


import base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

import pageobjects.HomePage;
import pageobjects.CheckBoxPage;

public class CheckBoxTest extends BaseTest {

    @Test
    public void verifyCheckBoxSelection() {
        new HomePage(driver).clickElementsCard();
        driver.get("https://demoqa.com/checkbox");

        CheckBoxPage checkBoxPage = new CheckBoxPage(driver);
        checkBoxPage.selectDownloadCheckbox();

        Assert.assertTrue(checkBoxPage.getResultText().contains("downloads"));
    }
}
