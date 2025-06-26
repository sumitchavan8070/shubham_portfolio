package sampletests;


import pageobjects.HomePage;
import pageobjects.TextBoxPage;

import org.testng.Assert;
import org.testng.annotations.Test;

import base.BaseTest;

public class TextBoxTest extends BaseTest {

    @Test
    public void verifyTextBoxSubmission() {
        new HomePage(driver).clickElementsCard();
        driver.get("https://demoqa.com/text-box");

        TextBoxPage textBox = new TextBoxPage(driver);
        textBox.fillForm("Sumit Chavan", "sumit@demo.com", "Pune", "Mumbai");

        Assert.assertTrue(textBox.getNameResult().contains("Sumit Chavan"));
    }
}
