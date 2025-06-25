package listeners;

import org.testng.ITestListener;
import org.testng.ITestResult;
import org.testng.ISuite;
import org.testng.ISuiteListener;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TestListener implements ITestListener, ISuiteListener {
    private static final String BACKEND_URL = "http://localhost:5000";
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Override
    public void onStart(ISuite suite) {
        System.out.println("🎬 Test Suite Started: " + suite.getName());
        System.out.println("⏰ Start Time: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        // Notify backend that test suite is starting
        sendNotification("/start-recording", "Test suite started");
    }

    @Override
    public void onFinish(ISuite suite) {
        System.out.println("🏁 Test Suite Finished: " + suite.getName());
        System.out.println("⏰ End Time: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        // Notify backend that test suite is finished
        sendNotification("/stop-recording", "Test suite finished");
    }

    @Override
    public void onTestStart(ITestResult result) {
        System.out.println("▶️  Test Started: " + result.getMethod().getMethodName());
        System.out.println("📝 Description: " + result.getMethod().getDescription());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        System.out.println("✅ Test Passed: " + result.getMethod().getMethodName());
        System.out.println("⏱️  Duration: " + (result.getEndMillis() - result.getStartMillis()) + "ms");
    }

    @Override
    public void onTestFailure(ITestResult result) {
        System.out.println("❌ Test Failed: " + result.getMethod().getMethodName());
        System.out.println("💥 Error: " + result.getThrowable().getMessage());
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        System.out.println("⏭️  Test Skipped: " + result.getMethod().getMethodName());
        System.out.println("🔍 Reason: " + result.getThrowable().getMessage());
    }

    private void sendNotification(String endpoint, String message) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BACKEND_URL + endpoint))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString("{\"message\":\"" + message + "\"}"))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() == 200) {
                            System.out.println("📡 Notification sent: " + message);
                        }
                    })
                    .exceptionally(throwable -> {
                        System.err.println("⚠️  Failed to send notification: " + throwable.getMessage());
                        return null;
                    });
        } catch (Exception e) {
            System.err.println("⚠️  Error sending notification: " + e.getMessage());
        }
    }
}
