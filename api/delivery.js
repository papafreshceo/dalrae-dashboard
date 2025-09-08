import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'DELIVERY!A:F',
    });

    const rows = response.data.values || [];
    
    // 헤더 제거
    const deliveryData = rows.slice(1);
    
    res.status(200).json(deliveryData);
  } catch (error) {
    console.error('Error fetching delivery data:', error);
    res.status(500).json({ error: 'Failed to fetch delivery data' });
  }
}
