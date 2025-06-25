package config;

import java.util.Arrays;
import java.util.List;

public class TestConfig {
    
    // Control which tests are visible to frontend users
    // Add test names here to make them available in the frontend
    public static final List<String> VISIBLE_TESTS = Arrays.asList(
        "AmazonTest.java",
        "RedBusTest.java"
        // Add more test files here as needed
        // "FlipkartTest.java",
        // "GoogleTest.java"
    );
    
    // Test suite configurations
    public static final String AMAZON_SUITE = "testng.xml";
    public static final String REDBUS_SUITE = "testng-redbus.xml";
    public static final String ALL_TESTS_SUITE = "testng-all.xml";
    
    // Test descriptions for frontend display
    public static String getTestDescription(String testName) {
        switch (testName) {
            case "AmazonTest.java":
                return "E-commerce automation testing on Amazon.com - Product search, navigation, and validation";
            case "RedBusTest.java":
                return "Travel booking automation on RedBus.in - Route search and bus listings verification";
            default:
                return "Selenium WebDriver automation test";
        }
    }
    
    // Get test suite for specific test
    public static String getTestSuite(String testName) {
        switch (testName) {
            case "AmazonTest.java":
                return AMAZON_SUITE;
            case "RedBusTest.java":
                return REDBUS_SUITE;
            default:
                return ALL_TESTS_SUITE;
        }
    }
}
