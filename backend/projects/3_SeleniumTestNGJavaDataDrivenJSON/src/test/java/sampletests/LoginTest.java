
package sampletests;

import base.BaseTest;
import base.JsonUtils;
import org.testng.Assert;
import org.testng.annotations.*;
import pageobjects.LoginPage;

public class LoginTest extends BaseTest {

    @DataProvider(name = "loginData")
    public Object[][] loginData() {
        String path = "resources/testdata.json";
        return JsonUtils.getTestData(path);
    }

    @Test(dataProvider = "loginData")
    public void testLogin(String username, String password) {
        driver.get("https://practicetestautomation.com/practice-test-login/");
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(username, password);

        if (username.equals("student") && password.equals("Password123")) {
            Assert.assertTrue(loginPage.isLoginSuccessful(), "Login should succeed");
        } else {
            Assert.assertFalse(loginPage.isLoginSuccessful(), "Login should fail");
        }
    }
}
