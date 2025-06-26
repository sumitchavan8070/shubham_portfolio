package sampletests;


import pageobjects.HomePage;

import org.testng.annotations.Test;

import base.BaseTest;

public class HomePageTest extends BaseTest {

    @Test
    public void verifyClickElementsCard() {
        HomePage homePage = new HomePage(driver);
        homePage.clickElementsCard();
    }
}
