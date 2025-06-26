
package base;

import com.google.gson.*;
import java.io.*;
import java.util.*;

public class JsonUtils {

    public static Object[][] getTestData(String filePath) {
        try (Reader reader = new FileReader(filePath)) {
            JsonArray jsonArray = JsonParser.parseReader(reader).getAsJsonArray();
            Object[][] data = new Object[jsonArray.size()][2];

            for (int i = 0; i < jsonArray.size(); i++) {
                JsonObject obj = jsonArray.get(i).getAsJsonObject();
                data[i][0] = obj.get("username").getAsString();
                data[i][1] = obj.get("password").getAsString();
            }
            return data;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
