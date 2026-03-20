// ══════════════════════════════════════════════════════════
//  IBI Pricing Calculator — Google Apps Script
//  India Business International · Dr. T. Sasimurugan
// ══════════════════════════════════════════════════════════
//
//  SETUP INSTRUCTIONS:
//  1. Open your Google Sheet (or create a new one)
//  2. Click Extensions → Apps Script
//  3. Delete any existing code and paste this entire file
//  4. Click Save (Ctrl+S)
//  5. Click Deploy → New deployment
//  6. Type: Web App
//  7. Description: IBI Pricing Calculator
//  8. Execute as: Me
//  9. Who has access: Anyone
//  10. Click Deploy → Authorize → Allow
//  11. Copy the Web App URL
//  12. Paste it in the calculator's Setup panel → Save URL
// ══════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('IBI Pricing Calculator')
                || ss.insertSheet('IBI Pricing Calculator');
    var data  = JSON.parse(e.postData.contents);

    // Write header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(data.headers);

      // Style the header row
      var headerRange = sheet.getRange(1, 1, 1, data.headers.length);
      headerRange.setFontWeight('bold')
                 .setBackground('#7c3aed')
                 .setFontColor('#ffffff')
                 .setFontFamily('Inter')
                 .setFontSize(10);

      // Freeze header row
      sheet.setFrozenRows(1);

      // Auto-resize columns
      sheet.autoResizeColumns(1, data.headers.length);
    }

    // Append the data row
    sheet.appendRow(data.values);

    // Style the new data row (alternating background)
    var row      = sheet.getLastRow();
    var rowRange = sheet.getRange(row, 1, 1, data.values.length);
    if (row % 2 === 0) {
      rowRange.setBackground('#f3eeff'); // light purple tint on even rows
    }

    // Auto-resize columns after each entry
    sheet.autoResizeColumns(1, data.headers.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'IBI Pricing Calculator endpoint is active',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
