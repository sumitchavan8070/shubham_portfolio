package utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Excel Utility Class for Data-Driven Testing
 * 
 * Features:
 * - Read/Write Excel files (.xlsx format)
 * - Get test data as Object arrays for TestNG DataProvider
 * - Cell formatting and validation
 * - Multiple sheet support
 * - Dynamic data retrieval
 * 
 * Usage Examples:
 * 1. Read test data: Object[][] data = ExcelUtils.getTestData("testdata.xlsx", "LoginTests");
 * 2. Write results: ExcelUtils.setCellData("results.xlsx", "TestResults", 1, 3, "PASS");
 * 3. Get row count: int rows = ExcelUtils.getRowCount("data.xlsx", "Sheet1");
 */
public class ExcelUtils {
    
    private static Workbook workbook;
    private static Sheet sheet;
    
    /**
     * Open Excel file and select worksheet
     * @param filePath Path to Excel file
     * @param sheetName Name of the worksheet
     */
    public static void setExcelFile(String filePath, String sheetName) {
        try {
            FileInputStream fis = new FileInputStream(filePath);
            workbook = new XSSFWorkbook(fis);
            sheet = workbook.getSheet(sheetName);
            if (sheet == null) {
                throw new RuntimeException("Sheet '" + sheetName + "' not found in " + filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to open Excel file: " + filePath, e);
        }
    }
    
    /**
     * Get cell data as string
     * @param rowNum Row number (0-based)
     * @param colNum Column number (0-based)
     * @return Cell value as string
     */
    public static String getCellData(int rowNum, int colNum) {
        try {
            Row row = sheet.getRow(rowNum);
            if (row == null) return "";
            
            Cell cell = row.getCell(colNum);
            if (cell == null) return "";
            
            switch (cell.getCellType()) {
                case STRING:
                    return cell.getStringCellValue();
                case NUMERIC:
                    if (DateUtil.isCellDateFormatted(cell)) {
                        return cell.getDateCellValue().toString();
                    } else {
                        return String.valueOf((long) cell.getNumericCellValue());
                    }
                case BOOLEAN:
                    return String.valueOf(cell.getBooleanCellValue());
                case FORMULA:
                    return cell.getCellFormula();
                default:
                    return "";
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get cell data at row " + rowNum + ", col " + colNum, e);
        }
    }
    
    /**
     * Set cell data
     * @param filePath Path to Excel file
     * @param sheetName Sheet name
     * @param rowNum Row number (0-based)
     * @param colNum Column number (0-based)
     * @param data Data to write
     */
    public static void setCellData(String filePath, String sheetName, int rowNum, int colNum, String data) {
        try {
            setExcelFile(filePath, sheetName);
            Row row = sheet.getRow(rowNum);
            if (row == null) {
                row = sheet.createRow(rowNum);
            }
            
            Cell cell = row.getCell(colNum);
            if (cell == null) {
                cell = row.createCell(colNum);
            }
            
            cell.setCellValue(data);
            
            FileOutputStream fos = new FileOutputStream(filePath);
            workbook.write(fos);
            fos.close();
            workbook.close();
        } catch (IOException e) {
            throw new RuntimeException("Failed to write cell data", e);
        }
    }
    
    /**
     * Get row count
     * @param filePath Path to Excel file
     * @param sheetName Sheet name
     * @return Number of rows
     */
    public static int getRowCount(String filePath, String sheetName) {
        setExcelFile(filePath, sheetName);
        return sheet.getLastRowNum() + 1;
    }
    
    /**
     * Get column count
     * @param filePath Path to Excel file
     * @param sheetName Sheet name
     * @return Number of columns
     */
    public static int getColCount(String filePath, String sheetName) {
        setExcelFile(filePath, sheetName);
        return sheet.getRow(0).getLastCellNum();
    }
    
    /**
     * Get test data for TestNG DataProvider
     * @param filePath Path to Excel file
     * @param sheetName Sheet name
     * @return 2D Object array for DataProvider
     */
    public static Object[][] getTestData(String filePath, String sheetName) {
        setExcelFile(filePath, sheetName);
        
        int rowCount = getRowCount(filePath, sheetName);
        int colCount = getColCount(filePath, sheetName);
        
        // Skip header row
        Object[][] data = new Object[rowCount - 1][colCount];
        
        for (int i = 1; i < rowCount; i++) {
            for (int j = 0; j < colCount; j++) {
                data[i - 1][j] = getCellData(i, j);
            }
        }
        
        try {
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return data;
    }
    
    /**
     * Get test data as List of Maps (column name as key)
     * @param filePath Path to Excel file
     * @param sheetName Sheet name
     * @return List of Maps containing test data
     */
    public static List<Map<String, String>> getTestDataAsMap(String filePath, String sheetName) {
        setExcelFile(filePath, sheetName);
        
        List<Map<String, String>> testData = new ArrayList<>();
        int rowCount = getRowCount(filePath, sheetName);
        int colCount = getColCount(filePath, sheetName);
        
        // Get headers from first row
        String[] headers = new String[colCount];
        for (int j = 0; j < colCount; j++) {
            headers[j] = getCellData(0, j);
        }
        
        // Get data rows
        for (int i = 1; i < rowCount; i++) {
            Map<String, String> rowData = new HashMap<>();
            for (int j = 0; j < colCount; j++) {
                rowData.put(headers[j], getCellData(i, j));
            }
            testData.add(rowData);
        }
        
        try {
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return testData;
    }
    
    /**
     * Create new Excel file with headers
     * @param filePath Path for new Excel file
     * @param sheetName Sheet name
     * @param headers Column headers
     */
    public static void createExcelFile(String filePath, String sheetName, String[] headers) {
        try {
            workbook = new XSSFWorkbook();
            sheet = workbook.createSheet(sheetName);
            
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                
                // Style header cells
                CellStyle headerStyle = workbook.createCellStyle();
                Font headerFont = workbook.createFont();
                headerFont.setBold(true);
                headerStyle.setFont(headerFont);
                cell.setCellStyle(headerStyle);
            }
            
            FileOutputStream fos = new FileOutputStream(filePath);
            workbook.write(fos);
            fos.close();
            workbook.close();
        } catch (IOException e) {
            throw new RuntimeException("Failed to create Excel file: " + filePath, e);
        }
    }
    
    /**
     * Check if cell is empty
     * @param rowNum Row number
     * @param colNum Column number
     * @return true if cell is empty
     */
    public static boolean isCellEmpty(int rowNum, int colNum) {
        String cellData = getCellData(rowNum, colNum);
        return cellData == null || cellData.trim().isEmpty();
    }
}
