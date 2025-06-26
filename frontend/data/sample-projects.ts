// // // data/sample-projects.ts

// // import { ProjectStructure } from "@/components/project-explorer";

// // export const sampleProjects: ProjectStructure[] = [
// //   {
// //     projectName: "DataDrivenFrameworkWithExcel",
// //     description: "Test automation framework with Excel data provider",
// //     structure: [
// //       {
// //         name: "src",
// //         type: "folder",
// //         children: [
// //           {
// //             name: "main",
// //             type: "folder",
// //             children: [
// //               {
// //                 name: "java",
// //                 type: "folder",
// //                 children: [
// //                   {
// //                     name: "com",
// //                     type: "folder",
// //                     children: [
// //                       {
// //                         name: "framework",
// //                         type: "folder",
// //                         children: [
// //                           {
// //                             name: "ExcelUtils.java",
// //                             type: "file",
// //                             content: `package com.framework;

// // import org.apache.poi.ss.usermodel.*;
// // import java.io.File;
// // import java.io.FileInputStream;
// // import java.util.HashMap;

// // public class ExcelUtils {
// //   private Workbook workbook;
// //   private Sheet sheet;

// //   public ExcelUtils(String filePath) {
// //     try {
// //       FileInputStream fis = new FileInputStream(new File(filePath));
// //       this.workbook = WorkbookFactory.create(fis);
// //     } catch (Exception e) {
// //       e.printStackTrace();
// //     }
// //   }

// //   public String getData(int rowNum, int colNum) {
// //     sheet = workbook.getSheetAt(0);
// //     return sheet.getRow(rowNum).getCell(colNum).toString();
// //   }
// // }`,
// //                           },
// //                           {
// //                             name: "TestBase.java",
// //                             type: "file",
// //                             content: `package com.framework;

// // import org.openqa.selenium.WebDriver;
// // import org.openqa.selenium.chrome.ChromeDriver;
// // import java.util.concurrent.TimeUnit;

// // public class TestBase {
// //   protected WebDriver driver;

// //   public void setUp() {
// //     System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
// //     driver = new ChromeDriver();
// //     driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
// //   }

// //   public void tearDown() {
// //     if (driver != null) {
// //       driver.quit();
// //     }
// //   }
// // }`,
// //                           },
// //                         ],
// //                       },
// //                     ],
// //                   },
// //                 ],
// //               },
// //             ],
// //           },
// //           {
// //             name: "test",
// //             type: "folder",
// //             children: [
// //               {
// //                 name: "java",
// //                 type: "folder",
// //                 children: [
// //                   {
// //                     name: "com",
// //                     type: "folder",
// //                     children: [
// //                       {
// //                         name: "tests",
// //                         type: "folder",
// //                         children: [
// //                           {
// //                             name: "LoginTests.java",
// //                             type: "file",
// //                             content: `package com.tests;

// // import com.framework.*;
// // import org.testng.annotations.*;

// // public class LoginTests extends TestBase {
// //   @Test(dataProvider = "excelData")
// //   public void testLogin(String username, String password) {
// //     // Test implementation here
// //   }

// //   @DataProvider
// //   public Object[][] excelData() {
// //     ExcelUtils excel = new ExcelUtils("testdata.xlsx");
// //     // Data provider implementation
// //   }
// // }`,
// //                           },
// //                         ],
// //                       },
// //                     ],
// //                   },
// //                 ],
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //       {
// //         name: "pom.xml",
// //         type: "file",
// //         content: `<project>
// //   <dependencies>
// //     <dependency>
// //       <groupId>org.seleniumhq.selenium</groupId>
// //       <artifactId>selenium-java</artifactId>
// //       <version>3.141.59</version>
// //     </dependency>
// //     <dependency>
// //       <groupId>org.testng</groupId>
// //       <artifactId>testng</artifactId>
// //       <version>7.4.0</version>
// //     </dependency>
// //     <dependency>
// //       <groupId>org.apache.poi</groupId>
// //       <artifactId>poi</artifactId>
// //       <version>5.0.0</version>
// //     </dependency>
// //   </dependencies>
// // </project>`,
// //       },
// //     ],
// //   },
// //   // Add more projects as needed
// // ];
// import { ProjectStructure } from "@/components/project-explorer";

// const sampleProjects: ProjectStructure[] = [
//   {
//     projectName: "SeleniumDataDrivenWithExcel",
//     description:
//       "Selenium framework using Apache POI for Excel-based test data, Maven build.",
//     structure: [
//       {
//         name: "pom.xml",
//         type: "file",
//         language: "xml",
//         content: `<project>
//   <modelVersion>4.0.0</modelVersion>
//   <groupId>com.test.excel</groupId>
//   <artifactId>selenium-excel</artifactId>
//   <version>1.0</version>
//   <dependencies>
//     <dependency>
//       <groupId>org.seleniumhq.selenium</groupId>
//       <artifactId>selenium-java</artifactId>
//       <version>4.15.0</version>
//     </dependency>
//     <dependency>
//       <groupId>org.apache.poi</groupId>
//       <artifactId>poi-ooxml</artifactId>
//       <version>5.2.3</version>
//     </dependency>
//   </dependencies>
// </project>`,
//       },
//       {
//         name: "src",
//         type: "folder",
//         children: [
//           {
//             name: "main",
//             type: "folder",
//             children: [
//               {
//                 name: "java",
//                 type: "folder",
//                 children: [
//                   {
//                     name: "utils",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "ExcelUtils.java",
//                         type: "file",
//                         language: "java",
//                         content: `public class ExcelUtils {
//   public static String getData(String sheet, int row, int col) {
//     // Apache POI logic here
//     return "sampleData";
//   }
// }`,
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             name: "test",
//             type: "folder",
//             children: [
//               {
//                 name: "java",
//                 type: "folder",
//                 children: [
//                   {
//                     name: "tests",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "LoginTest.java",
//                         type: "file",
//                         language: "java",
//                         content: `import org.testng.annotations.Test;

// public class LoginTest {
//   @Test
//   public void loginWithExcel() {
//     String user = ExcelUtils.getData("Login", 1, 0);
//     String pass = ExcelUtils.getData("Login", 1, 1);
//     System.out.println("Logging in with: " + user + "/" + pass);
//   }
// }`,
//                       },
//                     ],
//                   },
//                   {
//                     name: "resources",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "test-data.xlsx",
//                         type: "file",
//                         content: "// Excel placeholder",
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     projectName: "DataDrivenWithJSON",
//     description:
//       "TestNG Selenium project with JSON-based test data, Maven structure.",
//     structure: [
//       {
//         name: "pom.xml",
//         type: "file",
//         language: "xml",
//         content: `<project>
//   <modelVersion>4.0.0</modelVersion>
//   <groupId>com.test.json</groupId>
//   <artifactId>selenium-json</artifactId>
//   <version>1.0</version>
//   <dependencies>
//     <dependency>
//       <groupId>org.seleniumhq.selenium</groupId>
//       <artifactId>selenium-java</artifactId>
//       <version>4.15.0</version>
//     </dependency>
//     <dependency>
//       <groupId>org.json</groupId>
//       <artifactId>json</artifactId>
//       <version>20231013</version>
//     </dependency>
//   </dependencies>
// </project>`,
//       },
//       {
//         name: "src",
//         type: "folder",
//         children: [
//           {
//             name: "main",
//             type: "folder",
//             children: [
//               {
//                 name: "java",
//                 type: "folder",
//                 children: [
//                   {
//                     name: "utils",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "JSONUtils.java",
//                         type: "file",
//                         language: "java",
//                         content: `import org.json.JSONObject;

// public class JSONUtils {
//   public static JSONObject readJson(String file) {
//     return new JSONObject("{ \\"key\\": \\"value\\" }");
//   }
// }`,
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             name: "test",
//             type: "folder",
//             children: [
//               {
//                 name: "java",
//                 type: "folder",
//                 children: [
//                   {
//                     name: "tests",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "SearchTest.java",
//                         type: "file",
//                         language: "java",
//                         content: `import org.testng.annotations.Test;
// import org.json.JSONObject;

// public class SearchTest {
//   @Test
//   public void searchFromJson() {
//     JSONObject data = JSONUtils.readJson("search-data.json");
//     System.out.println("Search for: " + data.get("query"));
//   }
// }`,
//                       },
//                     ],
//                   },
//                   {
//                     name: "resources",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "search-data.json",
//                         type: "file",
//                         language: "json",
//                         content: `{
//   "query": "Selenium WebDriver Tutorial"
// }`,
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     projectName: "PageObjectModel",
//     description:
//       "POM-style Selenium framework with BaseTest and reusable pages.",
//     structure: [
//       {
//         name: "pom.xml",
//         type: "file",
//         language: "xml",
//         content: `<project>
//   <modelVersion>4.0.0</modelVersion>
//   <groupId>com.pom.example</groupId>
//   <artifactId>selenium-pom</artifactId>
//   <version>1.0</version>
//   <dependencies>
//     <dependency>
//       <groupId>org.seleniumhq.selenium</groupId>
//       <artifactId>selenium-java</artifactId>
//       <version>4.15.0</version>
//     </dependency>
//     <dependency>
//       <groupId>org.testng</groupId>
//       <artifactId>testng</artifactId>
//       <version>7.9.0</version>
//       <scope>test</scope>
//     </dependency>
//   </dependencies>
// </project>`,
//       },
//       {
//         name: "src",
//         type: "folder",
//         children: [
//           {
//             name: "main",
//             type: "folder",
//             children: [
//               {
//                 name: "java",
//                 type: "folder",
//                 children: [
//                   {
//                     name: "pages",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "LoginPage.java",
//                         type: "file",
//                         language: "java",
//                         content: `import org.openqa.selenium.*;

// public class LoginPage {
//   WebDriver driver;
//   By username = By.id("username");
//   By password = By.id("password");
//   By loginBtn = By.id("login");

//   public LoginPage(WebDriver driver) {
//     this.driver = driver;
//   }

//   public void login(String user, String pass) {
//     driver.findElement(username).sendKeys(user);
//     driver.findElement(password).sendKeys(pass);
//     driver.findElement(loginBtn).click();
//   }
// }`,
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             name: "test",
//             type: "folder",
//             children: [
//               {
//                 name: "java",
//                 type: "folder",
//                 children: [
//                   {
//                     name: "base",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "BaseTest.java",
//                         type: "file",
//                         language: "java",
//                         content: `import org.openqa.selenium.WebDriver;
// import org.openqa.selenium.chrome.ChromeDriver;
// import org.testng.annotations.*;

// public class BaseTest {
//   WebDriver driver;

//   @BeforeMethod
//   public void setup() {
//     driver = new ChromeDriver();
//     driver.get("https://example.com");
//   }

//   @AfterMethod
//   public void tearDown() {
//     driver.quit();
//   }
// }`,
//                       },
//                     ],
//                   },
//                   {
//                     name: "tests",
//                     type: "folder",
//                     children: [
//                       {
//                         name: "LoginTest.java",
//                         type: "file",
//                         language: "java",
//                         content: `import org.testng.annotations.Test;

// public class LoginTest extends BaseTest {
//   @Test
//   public void testLogin() {
//     LoginPage page = new LoginPage(driver);
//     page.login("admin", "admin123");
//   }
// }`,
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];

// export default sampleProjects;
