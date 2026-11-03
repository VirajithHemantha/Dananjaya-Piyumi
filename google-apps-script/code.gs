// Dananjaya & Piyumi wedding: RSVP and Wishes backend.
// Spreadsheet: https://docs.google.com/spreadsheets/d/1pl3N0tOkkaJevOhW7JamEmYu0vpwEo0Qd9iRRM4R1pU/edit
const SPREADSHEET_ID = '1pl3N0tOkkaJevOhW7JamEmYu0vpwEo0Qd9iRRM4R1pU';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Guests', 'Dietary Notes'],
    row: (p) => [new Date(), clean_(p.fullName), clean_(p.guests), clean_(p.dietaryNotes)],
  },
  WISH: {
    name: 'WISH',
    headers: ['Timestamp', 'Name', 'Message'],
    row: (p) => [new Date(), clean_(p.name), clean_(p.message)],
  },
};

const MAX_WISHES_RETURNED = 50;

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const payload = parsePayload_(e);
    const config = SHEETS[String(payload.sheet || '').toUpperCase()];
    if (!config) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use RSVP or WISH.' });
    }

    const sheet = getSheet_(config);
    sheet.appendRow(config.row(payload));

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

// GET ?action=wishes returns the latest wishes, newest first.
function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';

  if (action === 'wishes') {
    const sheet = getSheet_(SHEETS.WISH);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return jsonResponse_({ ok: true, wishes: [] });

    const count = Math.min(lastRow - 1, MAX_WISHES_RETURNED);
    const rows = sheet.getRange(lastRow - count + 1, 1, count, 3).getValues();
    const wishes = rows
      .filter((r) => r[1] && r[2])
      .map((r) => ({
        createdAt: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
        name: String(r[1]),
        message: String(r[2]),
      }))
      .reverse();

    return jsonResponse_({ ok: true, wishes: wishes });
  }

  return jsonResponse_({ ok: true, message: 'Wedding form endpoint is running.' });
}

// Run this once from the Apps Script editor to create both tabs with headers.
function setup() {
  getSheet_(SHEETS.RSVP);
  getSheet_(SHEETS.WISH);
}

function getSheet_(config) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(config.name) || ss.insertSheet(config.name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(config.headers);
    sheet.getRange(1, 1, 1, config.headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Stops values starting with = + - @ being run as spreadsheet formulas.
function clean_(value) {
  const text = String(value == null ? '' : value).trim().slice(0, 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};
  if (Object.keys(params).length > 0) return params;

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
