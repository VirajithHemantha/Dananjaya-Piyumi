# Connect RSVP & Wishes to Google Sheets

Spreadsheet: https://docs.google.com/spreadsheets/d/1pl3N0tOkkaJevOhW7JamEmYu0vpwEo0Qd9iRRM4R1pU/edit

1. Open the spreadsheet and go to **Extensions > Apps Script**.
2. Delete everything in `Code.gs` and paste the full contents of `google-apps-script/code.gs`. Click **Save**.
3. In the function dropdown pick `setup` and click **Run**. Approve the permissions
   (Advanced > Go to project > Allow). This creates the `RSVP` and `WISH` tabs with headers.
4. Click **Deploy > New deployment**, choose type **Web app**, then set:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
6. Paste that URL into `FALLBACK_SCRIPT_URL` in `src/utils/sheets.ts`, commit and push.
   (Or set `VITE_GOOGLE_APPS_SCRIPT_URL` in `.env` locally and in Vercel > Settings > Environment Variables.)
7. Check it works: open `<web app URL>?action=wishes` in the browser. It should show `{"ok":true,"wishes":[]}`.

Sheet columns:
- **RSVP**: Timestamp, Full Name, Guests, Dietary Notes
- **WISH**: Timestamp, Name, Message

If you change `code.gs` later: **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**.
This keeps the same URL.
