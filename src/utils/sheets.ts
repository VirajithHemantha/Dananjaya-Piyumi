// Paste your Apps Script Web App URL here (Deploy > Manage deployments > Web app URL),
// or set VITE_GOOGLE_APPS_SCRIPT_URL in .env / Vercel environment variables.
const FALLBACK_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_kRmABbGxPeXmV5yP_p-1iOHSOOkM7QYe1v_jqhfRqA0Eq9f9meUTf9HmAf6KXu1vKw/exec';

export const GOOGLE_SCRIPT_URL: string =
  import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || FALLBACK_SCRIPT_URL;

export interface SheetWish {
  name: string;
  message: string;
  createdAt: string;
}

// Apps Script does not send CORS headers on POST, so the response is opaque and we can only detect network errors.
export const submitToSheet = async (sheet: 'RSVP' | 'WISH', fields: Record<string, string>) => {
  if (!GOOGLE_SCRIPT_URL) throw new Error('Google Apps Script URL is not configured');

  const payload = new FormData();
  payload.append('sheet', sheet);
  Object.entries(fields).forEach(([key, value]) => payload.append(key, value));

  await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: payload });
};

export const fetchWishes = async (): Promise<SheetWish[]> => {
  if (!GOOGLE_SCRIPT_URL) return [];

  const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=wishes`);
  const data = await response.json();
  return data.ok && Array.isArray(data.wishes) ? data.wishes : [];
};
